using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using ThreadWars.Models;

public class ThreadEntrySerializer : SerializerBase<ThreadEntry>, IBsonDocumentSerializer
{
    private readonly IMongoCollection<User> _userCollection;

    public ThreadEntrySerializer(IMongoCollection<User> userCollection)
    {
        _userCollection = userCollection;
    }

    public override ThreadEntry Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
    {
        var document = BsonSerializer.Deserialize<BsonDocument>(context.Reader);
        
        var threadEntry = new ThreadEntry
        {
            _id = document["_id"].AsObjectId.ToString(),
            Content = document["content"].AsString,
            Media = document.Contains("media") ? document["media"].AsBsonArray.Select(m => BsonSerializer.Deserialize<ThreadMedia>(m.AsBsonDocument)).ToArray() : null,
            Likes = document.Contains("likes") ? document["likes"].AsBsonArray.Select(l => l.AsString).ToArray() : null,
            Replies = document.Contains("replies") ? document["replies"].AsBsonArray.Select(r => r.AsString).ToArray() : null,
            UserId = document["user"].AsObjectId.ToString(),
            CreatedAt = document["createdAt"].ToUniversalTime()
        };

        if (threadEntry.UserId != null)
        {
            var user = _userCollection.Find(u => ObjectId.Parse(u.Id) == ObjectId.Parse(threadEntry.UserId)).FirstOrDefault();
            threadEntry.User = user;
        }

        return threadEntry;
    }

    public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, ThreadEntry value)
    {
        var document = value.ToBsonDocument();
        BsonSerializer.Serialize(context.Writer, document);
    }


    public bool TryGetMemberSerializationInfo(string memberName, out BsonSerializationInfo serializationInfo)
    {
        serializationInfo = null;
        var documentSerializer = BsonSerializer.LookupSerializer<ThreadEntry>();
        
        return documentSerializer is IBsonDocumentSerializer bsonDocumentSerializer &&
               bsonDocumentSerializer.TryGetMemberSerializationInfo(memberName, out serializationInfo);
    }
}