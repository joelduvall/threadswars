
using Microsoft.AspNetCore.Mvc;
using ThreadWars.Models;
using ThreadWars.Services;

namespace ThreadWars.Controllers
{

  [ApiController]
  [Route("api/[controller]")]
  public class ThreadController : ControllerBase {
    private readonly IThreadService _threadService;

    public ThreadController(IThreadService threadService)  => _threadService = threadService;

    [HttpGet]
    public async Task<List<ThreadEntry>> Get() =>
          await _threadService.GetAsync();

}

}