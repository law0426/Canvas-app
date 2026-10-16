using System.Text.Json.Serialization;
using Knowtable.Api.Models;
using Microsoft.Extensions.Configuration;

namespace Knowtable.Api.Storage;

public sealed class FileCardStorage : ICardStorage
{
    private readonly string _rootPath;

    public FileCardStorage(IConfiguration configuration)
    {
        _rootPath = FileStorageHelpers.GetRootPath(configuration);
    }

    public Task<CardDocument?> LoadSavedCardAsync(
        Guid cardId,
        CancellationToken cancellationToken = default)
    {
        var path = Path.Combine(
            _rootPath, "Cards", cardId.ToString("D"));

        return LoadCardAsync(path, cardId, cancellationToken);
    }

    public Task StoreSavedCardAsync(
        CardDocument card,
        CancellationToken cancellationToken = default)
    {
        var path = Path.Combine(
            _rootPath, "Cards", card.Id.ToString("D"));

        return StoreCardAsync(path, card, cancellationToken);
    }

    public Task<CardDocument?> LoadUnsavedCardAsync(
        Guid projectId,
        Guid cardId,
        CancellationToken cancellationToken = default)
    {
        var path = Path.Combine(
            _rootPath,
            "Projects",
            projectId.ToString("D"),
            "Cards",
            cardId.ToString("D"));

        return LoadCardAsync(path, cardId, cancellationToken);
    }

    public Task StoreUnsavedCardAsync(
        Guid projectId,
        CardDocument card,
        CancellationToken cancellationToken = default)
    {
        var path = Path.Combine(
            _rootPath,
            "Projects",
            projectId.ToString("D"),
            "Cards",
            card.Id.ToString("D"));

        return StoreCardAsync(path, card, cancellationToken);
    }

    private static async Task<CardDocument?> LoadCardAsync(
        string directory,
        Guid cardId,
        CancellationToken cancellationToken)
    {
        var frontPath = Path.Combine(directory, "front.txt");
        var backPath = Path.Combine(directory, "back.json");

        if (!File.Exists(frontPath) && !File.Exists(backPath))
            return null;

        var frontContents = File.Exists(frontPath)
            ? await File.ReadAllTextAsync(frontPath, cancellationToken)
            : string.Empty;

        var (frontText, frontTimestamp) = ParseFrontFile(frontContents);

        var backFile = await FileStorageHelpers.ReadJsonAsync<CardBackFile>(
            backPath,
            cancellationToken);

        var timestamp =
            frontTimestamp ??
            backFile?.Metadata?.SavedAtUtc ??
            GetFallbackTimestamp(frontPath, backPath);

        return new CardDocument
        {
            Id = cardId,
            FrontText = frontText,
            Back = new CardBackDocument
            {
                TagIds = backFile?.TagIds ?? new()
            },
            SavedAtUtc = timestamp
        };
    }

    private static async Task StoreCardAsync(
        string directory,
        CardDocument card,
        CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(card);

        if (card.Id == Guid.Empty)
            throw new ArgumentException("Card ID cannot be empty.", nameof(card));

        var timestamp = card.SavedAtUtc;
        var frontPath = Path.Combine(directory, "front.txt");
        var backPath = Path.Combine(directory, "back.json");

        var frontContents =
            $"---\nsaved-at-utc: {timestamp:O}\n---\n{card.FrontText}";

        await FileStorageHelpers.WriteTextAtomicallyAsync(
            frontPath,
            frontContents,
            cancellationToken);

        var backFile = new CardBackFile
        {
            Metadata = new CardFileMetadata
            {
                SavedAtUtc = timestamp
            },
            TagIds = card.Back.TagIds
        };

        await FileStorageHelpers.WriteJsonAtomicallyAsync(
            backPath,
            backFile,
            cancellationToken);
    }

    private static (string Text, DateTimeOffset? Timestamp) ParseFrontFile(
        string contents)
    {
        using var reader = new StringReader(contents);

        if (reader.ReadLine() != "---")
            return (contents, null);

        var timestampLine = reader.ReadLine();

        if (timestampLine is null ||
            !timestampLine.StartsWith("saved-at-utc: "))
        {
            return (contents, null);
        }

        var closingSeparator = reader.ReadLine();

        if (closingSeparator != "---")
            return (contents, null);

        var timestampText = timestampLine["saved-at-utc: ".Length..];

        DateTimeOffset? timestamp =
            DateTimeOffset.TryParse(timestampText, out var parsed)
                ? parsed
                : null;

        // The header is metadata; the remaining text is the editable content.
        var text = reader.ReadToEnd();

        return (text, timestamp);
    }

    private static DateTimeOffset GetFallbackTimestamp(
        string frontPath,
        string backPath)
    {
        var existingPaths = new[] { frontPath, backPath }
            .Where(File.Exists)
            .ToArray();

        return existingPaths
            .Select(path => new DateTimeOffset(File.GetLastWriteTimeUtc(path)))
            .Max();
    }

    private sealed class CardBackFile
    {
        [JsonPropertyName("_meta")]
        public CardFileMetadata? Metadata { get; set; }

        public List<string> TagIds { get; set; } = new();
    }

    private sealed class CardFileMetadata
    {
        public DateTimeOffset? SavedAtUtc { get; set; }
    }
}