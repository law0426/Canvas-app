namespace Knowtable.Api.Models;

public sealed class ProjectDto
{
    public Guid Id { get; set; }

    public DateTimeOffset SavedAtUtc { get; set; }

    public List<CardDto> Cards { get; set; } = new();
}