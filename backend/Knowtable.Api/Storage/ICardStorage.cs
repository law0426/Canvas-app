using Knowtable.Api.Models;

namespace Knowtable.Api.Storage;

public interface ICardStorage
{
    Task<CardDocument?> LoadSavedCardAsync(
        Guid cardId,
        CancellationToken cancellationToken = default);

    Task StoreSavedCardAsync(
        CardDocument card,
        CancellationToken cancellationToken = default);

    Task<CardDocument?> LoadUnsavedCardAsync(
        Guid projectId,
        Guid cardId,
        CancellationToken cancellationToken = default);

    Task StoreUnsavedCardAsync(
        Guid projectId,
        CardDocument card,
        CancellationToken cancellationToken = default);
}