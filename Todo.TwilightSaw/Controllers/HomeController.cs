using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Todo.TwilightSaw.Models;

namespace Todo.TwilightSaw.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

    }
}
