-- Create Library Attendance Database
CREATE DATABASE LibraryAttendanceDB;
GO

USE LibraryAttendanceDB;
GO

-- Create Attendances Table
CREATE TABLE Attendances (
    Id INT PRIMARY KEY IDENTITY(1,1),
    VisitorName NVARCHAR(100) NOT NULL,
    VisitorId NVARCHAR(50) NOT NULL,
    Purpose NVARCHAR(200),
    CheckInTime DATETIME NOT NULL,
    CheckOutTime DATETIME NULL,
    CreatedAt DATETIME DEFAULT GETUTCDATE()
);
GO

-- Create Indexes for better query performance
CREATE INDEX IX_VisitorId ON Attendances(VisitorId);
CREATE INDEX IX_CheckInTime ON Attendances(CheckInTime);
CREATE INDEX IX_CheckOutTime ON Attendances(CheckOutTime);
GO

-- Optional: Insert sample data
INSERT INTO Attendances (VisitorName, VisitorId, Purpose, CheckInTime, CheckOutTime)
VALUES 
    ('John Smith', 'ID001', 'Research', '2026-04-16 09:00:00', '2026-04-16 11:30:00'),
    ('Sarah Johnson', 'ID002', 'Study', '2026-04-16 09:15:00', NULL),
    ('Mike Davis', 'ID003', 'Meeting', '2026-04-16 10:00:00', '2026-04-16 10:45:00');
GO