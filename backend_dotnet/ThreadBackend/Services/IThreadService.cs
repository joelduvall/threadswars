
using ThreadWars.Models;

namespace ThreadWars.Services
{
  public interface IThreadService
  {
      public Task<List<ThreadEntry>> GetAsync();

      public Task<ThreadEntry> GetAsync(string id);
  } 
}