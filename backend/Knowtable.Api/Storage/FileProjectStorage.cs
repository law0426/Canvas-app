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

    public async Task<IReadOnlyList<ProjectDocument>> ListProjectsAsync(
        CancellationToken cancellationToken = default)
    {
        if (!Directory.Exists(_projectsRoot))
            return Array.Empty<ProjectDocument>();

        var projects = new List<ProjectDocument>();

        foreach (var directory in Directory.EnumerateDirectories(_projectsRoot))
        {
            cancellationToken.ThrowIfCancellationRequested();

            var path = Path.Combine(directory, "project.json");

            var project = await FileStorageHelpers.ReadJsonAsync<ProjectDocument>(
                path,
                cancellationToken);

            if (project is not null)
                projects.Add(project);
        }

        return projects
            .OrderByDescending(project => project.SavedAtUtc)
            .ToList();
    }

    public async Task<ProjectDocument?> LoadProjectAsync(
        Guid projectId,
        CancellationToken cancellationToken = default)
    {
        if (projectId == Guid.Empty)
            throw new ArgumentException(
                "Project ID cannot be empty.",
                nameof(projectId));

        var path = GetProjectPath(projectId);

        var project = await FileStorageHelpers.ReadJsonAsync<ProjectDocument>(
            path,
            cancellationToken);

        if (project is not null && project.Id != projectId)
        {
            throw new InvalidDataException(
                $"Project ID in '{path}' does not match its directory.");
        }

        return project;
    }

    public async Task StoreProjectAsync(
        ProjectDocument project,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(project);

        if (project.Id == Guid.Empty)
            throw new ArgumentException(
                "Project ID cannot be empty.",
                nameof(project));

        project.SavedAtUtc = DateTimeOffset.UtcNow;

        await FileStorageHelpers.WriteJsonAtomicallyAsync(
            GetProjectPath(project.Id),
            project,
            cancellationToken);
    }

    private string GetProjectPath(Guid projectId)
    {
        return Path.Combine(
            _projectsRoot,
            projectId.ToString("D"),
            "project.json");
    }
}