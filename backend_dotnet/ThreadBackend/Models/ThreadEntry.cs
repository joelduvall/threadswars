using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ThreadWars.Models
{
  public class ThreadEntry
  {
      [BsonId]
      [BsonRepresentation(BsonType.ObjectId)]
#pragma warning disable IDE1006 // Naming Styles
        public required string _id { get; set; }
#pragma warning restore IDE1006 // Naming Styles

      [BsonElement("content")]
      public string? Content { get; set; }

      [BsonElement("media")]
      public IThreadMedia? Media { get; set; }

      [BsonElement("likes")]
      public string[]? Likes { get; set; }

      [BsonElement("replies")]
      public string[]? Replies { get; set; }

      [BsonElement("user")]
      [BsonRepresentation(BsonType.ObjectId)]
      public string UserId { get; set; }

      [BsonIgnore]
      public IUser? User { get; set; }

      [BsonElement("createdAt")]
      public DateTime CreatedAt { get; set; }
    
  }
}
