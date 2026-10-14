namespace Knowtable.Api.Models;

public sealed class WorkspaceDto
{
    public List<CardDto> Cards { get; set; } = new();
}

public sealed class CardDto
{
    public long Id { get; set; }

    public double X { get; set; }
    public double Y { get; set; }

    public double? Width { get; set; }
    public double? Height { get; set; }

    public string Text { get; set; } = string.Empty;

    public List<string> TagIds { get; set; } = new();
}
