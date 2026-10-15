namespace Knowtable.Api.Models;

public sealed class ProjectData
{
    public ProjectDocument Project { get; set; } = new();

    public List<CardDocument> Cards { get; set; } = new();
}