using Knowtable.Api.Models;
using Knowtable.Api.Storage;

namespace Knowtable.Api.Services;

public sealed class StorageOrchestrator
{
    private readonly IProjectStorage _projectStorage;
    private readonly ICardStorage _cardStorage;

    public StorageOrchestrator(
        IProjectStorage projectStorage,
        ICardStorage cardStorage)
    {
        _projectStorage = projectStorage;
        _cardStorage = cardStorage;
    }

    public async Task<ProjectData?> LoadProjectAsync(
        string projectId,
        CancellationToken cancellationToken = default)
    {
        var project = await _projectStorage.LoadProjectAsync(
            projectId,
            cancellationToken);

        if (project is null)
            return null;

        var cards = await LoadReferencedCardsAsync(
            project,
            cancellationToken);

        return new ProjectData
        {
            Project = project,
            Cards = cards
        };
    }

    public Task SaveProjectAsync(
        ProjectDocument project,
        CancellationToken cancellationToken = default)
    {
        return _projectStorage.SaveProjectAsync(
            project,
            cancellationToken);
    }

    public Task SaveCardAsync(
        CardDocument card,
        CancellationToken cancellationToken = default)
    {
        return _cardStorage.SaveCardAsync(
            card,
            cancellationToken);
    }

    public async Task<string> CreateManualSnapshotAsync(
        ProjectDocument project,
        CancellationToken cancellationToken = default)
    {
        var cards = await LoadReferencedCardsAsync(
            project,
            cancellationToken);

        return await _projectStorage.CreateManualSnapshotAsync(
            project,
            cards,
            cancellationToken);
    }

    private async Task<List<CardDocument>> LoadReferencedCardsAsync(
        ProjectDocument project,
        CancellationToken cancellationToken)
    {
        var cards = new List<CardDocument>();
        var loadedIds = new HashSet<long>();

        foreach (var instance in project.Cards)
        {
            // A project may reference a card only once in this result.
            if (!loadedIds.Add(instance.CardId))
                continue;

            var card = await _cardStorage.LoadCardAsync(
                instance.CardId,
                cancellationToken);

            if (card is null)
            {
                throw new InvalidOperationException(
                    $"Project '{project.Id}' references missing card " +
                    $"'{instance.CardId}'.");
            }

            cards.Add(card);
        }

        return cards;
    }
}