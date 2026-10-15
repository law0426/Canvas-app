using Knowtable.Api.Models;

namespace Knowtable.Api.Storage;

public interface IProjectStorage
{
    Task<ProjectDocument?> LoadProjectAsync(
        string projectId,
        CancellationToken cancellationToken = default);

    Task SaveProjectAsync(
        ProjectDocument project,
        CancellationToken cancellationToken = default);

    Task<string> CreateManualSnapshotAsync(
        ProjectDocument project,
        IReadOnlyCollection<CardDocument> cards,
        CancellationToken cancellationToken = default);
}