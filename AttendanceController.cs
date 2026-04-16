using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using LibraryAttendanceSystem.Models;

namespace LibraryAttendanceSystem.Controllers
{
    public class AttendanceController : Controller
    {
        // Temporary storage (replace with DB later)
        private static List<Attendance> records = new List<Attendance>();
        private static int counter = 1;

        public IActionResult Index()
        {
            return View(records);
        }

        [HttpPost]
        public IActionResult CheckIn(string visitorName, string visitorId, string purpose)
        {
            var existing = records.FirstOrDefault(r => r.VisitorId == visitorId && r.CheckOutTime == null);

            if (existing != null)
            {
                TempData["Error"] = "Already checked in!";
                return RedirectToAction("Index");
            }

            records.Add(new Attendance
            {
                Id = counter++,
                VisitorName = visitorName,
                VisitorId = visitorId,
                Purpose = purpose,
                CheckInTime = DateTime.Now
            });

            return RedirectToAction("Index");
        }

        public IActionResult CheckOut(int id)
        {
            var record = records.FirstOrDefault(r => r.Id == id);
            if (record != null)
            {
                record.CheckOutTime = DateTime.Now;
            }

            return RedirectToAction("Index");
        }
    }
}