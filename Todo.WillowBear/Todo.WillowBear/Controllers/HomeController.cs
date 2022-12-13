using Microsoft.AspNetCore.Mvc;
using Serilog;
using System.Diagnostics;
using Todo.WillowBear.Data;
using Todo.WillowBear.Models;

namespace Todo.WillowBear.Controllers;
public class HomeController : Controller
{
    private readonly TodoDbContext _context;

    public HomeController(TodoDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        Log.Error("Error Occured");
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
