
using ThreadWars.Models;

namespace ThreadWars.Services
{
  public interface IThreadService
  {
      public Task<List<ThreadEntry>> GetAsync();
  } 
}