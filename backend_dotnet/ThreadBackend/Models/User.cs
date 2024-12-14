using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using ThreadWars.Models;

namespace ThreadWars.Models
{
    public class User : IUser
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("username")]
        public string username { get; set; }

        [BsonElement("externalId")]
        public string externalId { get; set; }

        [BsonElement("email")]
        public string email { get; set; }

        [BsonElement("firstName")]
        public string firstName { get; set; }

        [BsonElement("lastName")]
        public string lastName { get; set; }

        [BsonElement("authProvider")]
        public string authProvider { get; set; }

        [BsonElement("avatar")]
        public string avatar { get; set; }

        [BsonElement("isVerified")]
        public bool isVerified { get; set; }
    }
}