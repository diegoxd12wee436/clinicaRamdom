using Microsoft.AspNetCore.Mvc;

namespace clinicaRamdom.Controllers
{
    public class PacientesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
