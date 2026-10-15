using Knowtable.Api.Models;
using Microsoft.Extensions.Configuration;

namespace Knowtable.Api.Storage;

public sealed class FileCardStorage : ICardStorage
{
    private readonly string _cardsRoot;

    public FileCardStorage(IConfiguration configuration)
    {
        _cardsRoot = Path.Combine(
            FileStorageHelpers.GetRootPath(configuration),
            "Cards");
    }

    public async Task<CardDocument?> LoadCardAsync(
        long cardId,
        CancellationToken cancellationToken = default)
    {
        var cardDirectory = Path.Combine(
            _cardsRoot,
            FileStorageHelpers.GetCardFolderName(cardId));

        var frontPath = Path.Combine(cardDirectory, "front.txt");
        var backPath = Path.Combine(cardDirectory, "back.json");

        if (!File.Exists(frontPath) && !File.Exists(backPath))
            return null;

        var frontText = File.Exists(frontPath)
            ? await File.ReadAllTextAsync(frontPath, cancellationToken)
            : string.Empty;

        var back = await FileStorageHelpers.ReadJsonAsync<CardBackData>(
            backPath,
            cancellationToken);

        return new CardDocument
        {
            Id = cardId,
            FrontText = frontText,
            Back = back ?? new CardBackData()
        };
    }

    public Task SaveCardAsync(
        CardDocument card,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(card);

        return FileStorageHelpers.WriteCardFilesAsync(
            _cardsRoot,
            card,
            cancellationToken);
    }
}
