
using Knowtable.Api.Models;

namespace Knowtable.Api.Storage;

public interface ICardStorage
{
    Task<CardDocument?> LoadCardAsync(
        long cardId,
        CancellationToken cancellationToken = default);

    Task SaveCardAsync(
        CardDocument card,
        CancellationToken cancellationToken = default);
}