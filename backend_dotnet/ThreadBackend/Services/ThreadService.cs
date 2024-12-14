using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ThreadWars.Models;

namespace ThreadWars.Services
{
  public class ThreadService : IThreadService
  {
      private readonly IMongoCollection<ThreadEntry> _threadCollection  ;

      public ThreadService(IOptions<ThreadDatabaseSettings> settings) {
        var mongoClient = new MongoClient(
              settings.Value.Host);

          var mongoDatabase = mongoClient.GetDatabase(
              settings.Value.DatabaseName);        
          
          _threadCollection = mongoDatabase.GetCollection<ThreadEntry>("threads");
      }

      public async Task<List<ThreadEntry>> GetAsync() {
          return await _threadCollection.Find(
            thread => true
          ).ToListAsync();
      } 

      public async Task<ThreadEntry> GetAsync(string id) {
          return await _threadCollection.Find(
            thread => thread._id == id
          ).FirstOrDefaultAsync();
      }
  }
}