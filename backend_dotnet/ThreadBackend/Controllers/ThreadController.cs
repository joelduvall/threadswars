
using Microsoft.AspNetCore.Mvc;
using ThreadWars.Models;
using ThreadWars.Services;

namespace ThreadWars.Controllers
{

  [ApiController]
  [Route("api/Thread")]
  public class ThreadController : ControllerBase {
    private readonly IThreadService _threadService;

    public ThreadController(IThreadService threadService)  => _threadService = threadService;

    [HttpGet]
    public async Task<List<ThreadEntry>> Get() => await _threadService.GetAsync();

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<ThreadEntry>> Get(string id) {
      var thread = await _threadService.GetAsync(id);

      if (thread == null) {
        return NotFound();
      }

      return Ok(thread);
    }
  }

}