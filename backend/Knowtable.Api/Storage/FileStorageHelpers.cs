using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Knowtable.Api.Models;
using Microsoft.Extensions.Configuration;

namespace Knowtable.Api.Storage;

internal static class FileStorageHelpers
{
    internal static JsonSerializerOptions JsonOptions { get; } =
        new(JsonSerializerDefaults.Web)
        {
            WriteIndented = true
        };

    internal static string GetRootPath(IConfiguration configuration)
    {
        var configuredPath = configuration["Storage:RootPath"];

        if (!string.IsNullOrWhiteSpace(configuredPath))
            return Path.GetFullPath(configuredPath);

        var documentsPath =
            Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);

        if (string.IsNullOrWhiteSpace(documentsPath))
            documentsPath = AppContext.BaseDirectory;

        return Path.Combine(documentsPath, "KnowtableData");
    }

    internal static string ValidateProjectId(string projectId)
    {
        if (string.IsNullOrWhiteSpace(projectId) ||
            !Regex.IsMatch(projectId, @"\A[a-zA-Z0-9_-]+\z"))
        {
            throw new ArgumentException(
                "Project IDs may contain only letters, numbers, hyphens, and underscores.",
                nameof(projectId));
        }

        return projectId;
    }

    internal static string GetCardFolderName(long cardId)
    {
        if (cardId <= 0)
            throw new ArgumentOutOfRangeException(nameof(cardId));

        return cardId.ToString();
    }

    internal static async Task<T?> ReadJsonAsync<T>(
        string path,
        CancellationToken cancellationToken = default)
        where T : class
    {
        if (!File.Exists(path))
            return null;

        var json = await File.ReadAllTextAsync(path, cancellationToken);

        return JsonSerializer.Deserialize<T>(json, JsonOptions);
    }

    internal static async Task WriteJsonAtomicallyAsync<T>(
        string path,
        T value,
        CancellationToken cancellationToken = default)
    {
        var json = JsonSerializer.Serialize(value, JsonOptions);

        await WriteTextAtomicallyAsync(path, json, cancellationToken);
    }

    internal static async Task WriteTextAtomicallyAsync(
        string path,
        string contents,
        CancellationToken cancellationToken = default)
    {
        var directory = Path.GetDirectoryName(path)
            ?? throw new InvalidOperationException("Invalid file path.");

        Directory.CreateDirectory(directory);

        var tempPath = $"{path}.{Guid.NewGuid():N}.tmp";

        try
        {
            await File.WriteAllTextAsync(
                tempPath,
                contents,
                new UTF8Encoding(false),
                cancellationToken);

            cancellationToken.ThrowIfCancellationRequested();

            File.Move(tempPath, path, overwrite: true);
        }
        finally
        {
            if (File.Exists(tempPath))
                File.Delete(tempPath);
        }
    }

    internal static async Task WriteCardFilesAsync(
        string cardsRoot,
        CardDocument card,
        CancellationToken cancellationToken = default)
    {
        var cardDirectory = Path.Combine(
            cardsRoot,
            GetCardFolderName(card.Id));

        Directory.CreateDirectory(cardDirectory);

        await WriteTextAtomicallyAsync(
            Path.Combine(cardDirectory, "front.txt"),
            card.FrontText ?? string.Empty,
            cancellationToken);

        await WriteJsonAtomicallyAsync(
            Path.Combine(cardDirectory, "back.json"),
            card.Back ?? new CardBackData(),
            cancellationToken);
    }
}

