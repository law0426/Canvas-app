namespace Knowtable.Api.Models;

public sealed class ProjectDocument
{
    public string Id { get; set; } = string.Empty;

    public List<CardInstance> Cards { get; set; } = new();
}