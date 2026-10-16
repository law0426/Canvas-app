namespace Knowtable.Api.Models;

public sealed class CardDto
{
    public Guid Id { get; set; }

    public string Text { get; set; } = string.Empty;

    public List<string> TagIds { get; set; } = new();

    public double X { get; set; }
    public double Y { get; set; }

    public double Width { get; set; } = 240;
    public double Height { get; set; } = 180;

    public DateTimeOffset SavedAtUtc { get; set; } = DateTimeOffset.UtcNow;
}