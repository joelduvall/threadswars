namespace ThreadWars.Models
{
  public interface IThreadMedia
  {
    public string url { get; set; }
    public string type { get; set; }
    public int height { get; set; }
    public int width { get; set; }

  }
}