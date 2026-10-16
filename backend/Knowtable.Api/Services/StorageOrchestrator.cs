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

    public async Task<ProjectDto?> LoadProjectAsync(
        Guid projectId,
        CancellationToken cancellationToken = default)
    {
        var project = await _projectStorage.LoadProjectAsync(
            projectId,
            cancellationToken);

        if (project is null)
            return null;

        var cards = new List<CardDto>(project.Cards.Count);

        foreach (var instance in project.Cards)
        {
            var card = await _cardStorage.LoadUnsavedCardAsync(
                projectId,
                instance.CardId,
                cancellationToken);

            // Initialize a missing working copy from the saved file.
            if (card is null)
            {
                card = await _cardStorage.LoadSavedCardAsync(
                    instance.CardId,
                    cancellationToken);

                if (card is null)
                {
                    throw new InvalidDataException(
                        $"Card '{instance.CardId}' has no saved file.");
                }

                card.SavedAtUtc = DateTimeOffset.UtcNow;

                await _cardStorage.StoreUnsavedCardAsync(
                    projectId,
                    card,
                    cancellationToken);
            }

            cards.Add(ToDto(card, instance.Geometry));
        }

        return new ProjectDto
        {
            Id = project.Id,
            SavedAtUtc = project.SavedAtUtc,
            Cards = cards
        };
    }

    // Autosave card content to the project's working copy.
    public async Task<CardDto> AutosaveCardAsync(
        Guid projectId,
        CardDto card,
        CancellationToken cancellationToken = default)
    {
        ValidateCard(projectId, card);

        var document = ToDocument(card, DateTimeOffset.UtcNow);

        await _cardStorage.StoreUnsavedCardAsync(
            projectId,
            document,
            cancellationToken);

        card.SavedAtUtc = document.SavedAtUtc;

        return card;
    }

    // Autosave project layout separately from card content.
    public async Task<ProjectDto> AutosaveProjectLayoutAsync(
        ProjectDto project,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(project);

        if (project.Id == Guid.Empty)
            throw new ArgumentException("Project ID cannot be empty.");

        EnsureUniqueCardIds(project.Cards);

        var document = new ProjectDocument
        {
            Id = project.Id,
            Cards = project.Cards.Select(card => new CardInstance
            {
                CardId = card.Id,
                Geometry = new CardGeometry
                {
                    X = card.X,
                    Y = card.Y,
                    Width = card.Width,
                    Height = card.Height
                }
            }).ToList()
        };

        await _projectStorage.StoreProjectAsync(
            document,
            cancellationToken);

        project.SavedAtUtc = document.SavedAtUtc;

        return project;
    }

    // Save the current card as the saved version.
    public async Task<CardDto> SaveCardAsync(
        Guid projectId,
        CardDto card,
        CancellationToken cancellationToken = default)
    {
        ValidateCard(projectId, card);

        var document = ToDocument(card, DateTimeOffset.UtcNow);

        // Preserve the current working copy before updating the saved file.
        await _cardStorage.StoreUnsavedCardAsync(
            projectId,
            document,
            cancellationToken);

        await _cardStorage.StoreSavedCardAsync(
            document,
            cancellationToken);

        card.SavedAtUtc = document.SavedAtUtc;

        return card;
    }

    // Replace working content with saved content, preserving project geometry.
    public async Task<CardDto> RevertCardAsync(
        Guid projectId,
        CardDto currentCard,
        CancellationToken cancellationToken = default)
    {
        ValidateCard(projectId, currentCard);

        var savedCard = await _cardStorage.LoadSavedCardAsync(
            currentCard.Id,
            cancellationToken);

        if (savedCard is null)
        {
            throw new FileNotFoundException(
                $"Saved card '{currentCard.Id}' was not found.");
        }

        var revertedCard = new CardDocument
        {
            Id = savedCard.Id,
            FrontText = savedCard.FrontText,
            Back = new CardBackDocument
            {
                TagIds = savedCard.Back.TagIds.ToList()
            },
            SavedAtUtc = DateTimeOffset.UtcNow
        };

        await _cardStorage.StoreUnsavedCardAsync(
            projectId,
            revertedCard,
            cancellationToken);

        return ToDto(
            revertedCard,
            new CardGeometry
            {
                X = currentCard.X,
                Y = currentCard.Y,
                Width = currentCard.Width,
                Height = currentCard.Height
            });
    }

    private static CardDocument ToDocument(
        CardDto card,
        DateTimeOffset savedAtUtc)
    {
        return new CardDocument
        {
            Id = card.Id,
            FrontText = card.Text,
            Back = new CardBackDocument
            {
                TagIds = card.TagIds.ToList()
            },
            SavedAtUtc = savedAtUtc
        };
    }

    private static CardDto ToDto(
        CardDocument card,
        CardGeometry geometry)
    {
        return new CardDto
        {
            Id = card.Id,
            Text = card.FrontText,
            TagIds = card.Back.TagIds.ToList(),
            X = geometry.X,
            Y = geometry.Y,
            Width = geometry.Width,
            Height = geometry.Height,
            SavedAtUtc = card.SavedAtUtc
        };
    }

    private static void ValidateCard(Guid projectId, CardDto card)
    {
        ArgumentNullException.ThrowIfNull(card);

        if (projectId == Guid.Empty)
            throw new ArgumentException("Project ID cannot be empty.");

        if (card.Id == Guid.Empty)
            throw new ArgumentException("Card ID cannot be empty.");
    }

    private static void EnsureUniqueCardIds(List<CardDto> cards)
    {
        if (cards.Select(card => card.Id).Distinct().Count() != cards.Count)
        {
            throw new InvalidOperationException(
                "A project cannot contain duplicate card IDs.");
        }
    }
}