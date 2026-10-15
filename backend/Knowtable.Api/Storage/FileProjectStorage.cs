using Knowtable.Api.Models;
using Microsoft.Extensions.Configuration;

namespace Knowtable.Api.Storage;

public sealed class FileProjectStorage : IProjectStorage
{
    private readonly string _projectsRoot;

    public FileProjectStorage(IConfiguration configuration)
    {
        _projectsRoot = Path.Combine(
            FileStorageHelpers.GetRootPath(configuration),
            "Projects");
    }

    public async Task<ProjectDocument?> LoadProjectAsync(
        string projectId,
        CancellationToken cancellationToken = default)
    {
        projectId = FileStorageHelpers.ValidateProjectId(projectId);

        var projectPath = Path.Combine(
            _projectsRoot,
            projectId,
            "project.json");

        var project = await FileStorageHelpers.ReadJsonAsync<ProjectDocument>(
            projectPath,
            cancellationToken);

        if (project is not null &&
            !string.Equals(project.Id, projectId, StringComparison.Ordinal))
        {
            throw new InvalidDataException(
                $"Project ID in '{projectPath}' does not match its folder.");
        }

        return project;
    }

    public async Task SaveProjectAsync(
        ProjectDocument project,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(project);

        var projectId = FileStorageHelpers.ValidateProjectId(project.Id);

        var projectPath = Path.Combine(
            _projectsRoot,
            projectId,
            "project.json");

        await FileStorageHelpers.WriteJsonAtomicallyAsync(
            projectPath,
            project,
            cancellationToken);
    }

    public async Task<string> CreateManualSnapshotAsync(
        ProjectDocument project,
        IReadOnlyCollection<CardDocument> cards,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(project);
        ArgumentNullException.ThrowIfNull(cards);

        var projectId = FileStorageHelpers.ValidateProjectId(project.Id);

        var cardsById = cards.ToDictionary(card => card.Id);

        var referencedIds = project.Cards
            .Select(instance => instance.CardId)
            .Distinct()
            .ToArray();

        foreach (var cardId in referencedIds)
        {
            if (!cardsById.ContainsKey(cardId))
            {
                throw new InvalidOperationException(
                    $"Cannot snapshot project '{projectId}': " +
                    $"card '{cardId}' was not loaded.");
            }
        }

        var savesRoot = Path.Combine(
            _projectsRoot,
            projectId,
            "Saves");

        Directory.CreateDirectory(savesRoot);

        var snapshotName =
            $"{DateTime.UtcNow:yyyyMMdd'T'HHmmssfff'Z'}-{Guid.NewGuid():N}";

        var stagingPath = Path.Combine(
            savesRoot,
            $".tmp-{Guid.NewGuid():N}");

        var snapshotPath = Path.Combine(savesRoot, snapshotName);

        Directory.CreateDirectory(stagingPath);

        try
        {
            await FileStorageHelpers.WriteJsonAtomicallyAsync(
                Path.Combine(stagingPath, "project.json"),
                project,
                cancellationToken);

            var snapshotCardsRoot = Path.Combine(stagingPath, "Cards");

            foreach (var cardId in referencedIds)
            {
                await FileStorageHelpers.WriteCardFilesAsync(
                    snapshotCardsRoot,
                    cardsById[cardId],
                    cancellationToken);
            }

            cancellationToken.ThrowIfCancellationRequested();

            // Publish the snapshot only after all its files are written.
            Directory.Move(stagingPath, snapshotPath);

            return snapshotName;
        }
        catch
        {
            if (Directory.Exists(stagingPath))
                Directory.Delete(stagingPath, recursive: true);

            throw;
        }
    }
}
