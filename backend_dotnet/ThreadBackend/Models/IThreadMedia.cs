namespace ThreadWars.Models
{
  public interface IThreadMedia
  {
    public string Url { get; set; }
    public string Type { get; set; }
    public int Height { get; set; }
    public int Width { get; set; }

  }
}

