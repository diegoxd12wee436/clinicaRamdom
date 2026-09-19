using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace clinicaRamdom.Controllers
{
    [ApiController] //le dice quiero que me la trates como un api
    [Route("api/[controller]")]
    public class PacientesController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return Ok("Hoola a todosososodoskdoskd");
        }
    }
}
