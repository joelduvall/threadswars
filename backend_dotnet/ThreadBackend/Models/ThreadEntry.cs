using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ThreadWars.Models
{
  public class ThreadEntry
  {
      [BsonId]
      [BsonRepresentation(BsonType.ObjectId)]
      public string _id { get; set; }

      [BsonElement("content")]
      public string? Content { get; set; }

      [BsonElement("media")]
      public IThreadMedia Media { get; set; }

      [BsonElement("likes")]
      public string[]? Likes { get; set; }

      [BsonElement("replies")]
      public string[]? Replies { get; set; }

      [BsonElement("user")]
      public IUser User { get; set; }

      [BsonElement("createdAt")]
      public DateTime CreatedAt { get; set; }
    
  }
}
