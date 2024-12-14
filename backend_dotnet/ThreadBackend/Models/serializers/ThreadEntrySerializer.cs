using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using ThreadWars.Models;

public class ThreadEntrySerializer : SerializerBase<ThreadEntry>, IBsonDocumentSerializer
{
    //private readonly IMongoCollection<User> _userCollection;

    // public ThreadEntrySerializer(IMongoCollection<User> userCollection)
    // {
    //     _userCollection = userCollection;
    // }

    public override ThreadEntry Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
    {
        var document = BsonSerializer.Deserialize<BsonDocument>(context.Reader);
        var threadEntry = BsonSerializer.Deserialize<ThreadEntry>(document);

        if (threadEntry.UserId != null)
        {
           // var user = _userCollection.Find(u => u.Id == threadEntry.UserId).FirstOrDefault();
            //threadEntry.User = user;
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