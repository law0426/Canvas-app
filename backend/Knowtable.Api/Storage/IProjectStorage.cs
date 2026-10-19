using Knowtable.Api.Models;

namespace Knowtable.Api.Storage;

public interface IProjectStorage
{
    Task<ProjectDocument?> LoadProjectAsync(
        Guid projectId,
        CancellationToken cancellationToken = default);

    Task StoreProjectAsync(
        ProjectDocument project,
        CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ProjectDocument>> ListProjectsAsync(
        CancellationToken cancellationToken = default);
}