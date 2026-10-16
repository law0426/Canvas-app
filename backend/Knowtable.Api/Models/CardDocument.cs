namespace Knowtable.Api.Models;

public sealed class CardDocument
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string FrontText { get; set; } = string.Empty;

    public CardBackDocument Back { get; set; } = new();

    public DateTimeOffset SavedAtUtc { get; set; } = DateTimeOffset.UtcNow;
}

public sealed class CardBackDocument
{
    public List<string> TagIds { get; set; } = new();
}