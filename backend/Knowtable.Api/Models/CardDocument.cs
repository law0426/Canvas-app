namespace Knowtable.Api.Models;

public sealed class CardDocument
{
    public long Id { get; set; }

    public string FrontText { get; set; } = string.Empty;

    public CardBackData Back { get; set; } = new();
}

public sealed class CardBackData
{
    public List<string> TagIds { get; set; } = new();
}