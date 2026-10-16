using System.Text;
using System.Text.Json;
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
}