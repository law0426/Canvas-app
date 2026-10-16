namespace Knowtable.Api.Models;

public sealed class CardInstance
{
    public Guid CardId { get; set; }

    public CardGeometry Geometry { get; set; } = new();
}

public sealed class CardGeometry
{
    public double X { get; set; }
    public double Y { get; set; }

    public double Width { get; set; } = 240;
    public double Height { get; set; } = 180;
}