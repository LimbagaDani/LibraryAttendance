using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LibraryAttendanceSystem.Models;
using LibraryAttendanceSystem.Data;

namespace LibraryAttendanceSystem.Controllers
{
    public class AttendanceController : Controller
    {
        private readonly LibraryAttendanceContext _context;

        public AttendanceController(LibraryAttendanceContext context)
        {
            _context = context;
        }

        // GET: Display all attendance records for today
        public async Task<IActionResult> Index()
        {
            var today = DateTime.Now.Date;
            var records = await _context.Attendances
                .Where(r => r.CheckInTime.Date == today)
                .OrderByDescending(r => r.CheckInTime)
                .ToListAsync();

            return View(records);
        }

        // POST: Check in a visitor
        [HttpPost]
        public async Task<IActionResult> CheckIn(string visitorName, string visitorId, string purpose)
        {
            if (string.IsNullOrEmpty(visitorName) || string.IsNullOrEmpty(visitorId))
            {
                TempData["Error"] = "Visitor name and ID are required!";
                return RedirectToAction("Index");
            }

            // Check if already checked in today
            var existing = await _context.Attendances
                .FirstOrDefaultAsync(r => r.VisitorId == visitorId && r.CheckOutTime == null);

            if (existing != null)
            {
                TempData["Error"] = "This visitor is already checked in!";
                return RedirectToAction("Index");
            }

            var attendance = new Attendance
            {
                VisitorName = visitorName,
                VisitorId = visitorId,
                Purpose = purpose,
                CheckInTime = DateTime.Now
            };

            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync();

            TempData["Success"] = $"{visitorName} checked in successfully!";
            return RedirectToAction("Index");
        }

        // GET: Check out a visitor
        public async Task<IActionResult> CheckOut(int id)
        {
            var record = await _context.Attendances.FindAsync(id);
            if (record != null && record.CheckOutTime == null)
            {
                record.CheckOutTime = DateTime.Now;
                _context.Attendances.Update(record);
                await _context.SaveChangesAsync();
                TempData["Success"] = $"{record.VisitorName} checked out successfully!";
            }

            return RedirectToAction("Index");
        }

        // GET: Get all records (for API)
        [HttpGet]
        public async Task<IActionResult> GetAllRecords()
        {
            var records = await _context.Attendances.ToListAsync();
            return Json(records);
        }

        // GET: Get today's records (for API)
        [HttpGet]
        public async Task<IActionResult> GetTodayRecords()
        {
            var today = DateTime.Now.Date;
            var records = await _context.Attendances
                .Where(r => r.CheckInTime.Date == today)
                .OrderByDescending(r => r.CheckInTime)
                .ToListAsync();

            return Json(records);
        }
    }
}