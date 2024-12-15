using MongoDB.Bson.Serialization.Attributes;

namespace ThreadWars.Models
{
  [BsonIgnoreExtraElements]
  public class ThreadMedia : IThreadMedia
  {
      [BsonElement("url")]
      public string Url { get; set; }

      [BsonElement("type")]
      public string Type { get; set; }

      [BsonElement("height")]
      public int Height { get; set; }

      [BsonElement("width")]
      public int Width { get; set; }
  }
}

