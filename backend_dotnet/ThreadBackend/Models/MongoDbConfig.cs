using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using ThreadWars.Models;

public class MongoDbConfig
{
    public static void RegisterSerializers(IMongoDatabase database)
    {
        var userCollection = database.GetCollection<User>("User");
        BsonSerializer.RegisterSerializer(new ThreadEntrySerializer(userCollection));
    }
}