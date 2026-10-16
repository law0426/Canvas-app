namespace Knowtable.Api.Models;

public sealed class ProjectDocument
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public DateTimeOffset SavedAtUtc { get; set; } = DateTimeOffset.UtcNow;

    public List<CardInstance> Cards { get; set; } = new();
}