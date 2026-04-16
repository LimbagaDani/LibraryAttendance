using System;

namespace LibraryAttendanceSystem.Models
{
    public class Attendance
    {
        public int Id { get; set; }
        public string VisitorName { get; set; }
        public string VisitorId { get; set; }
        public string Purpose { get; set; }
        public DateTime CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
    }
}