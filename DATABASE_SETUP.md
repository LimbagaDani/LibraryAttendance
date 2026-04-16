# Library Attendance System - Database Setup

## Files Created

### 1. *LibraryAttendanceContext.cs*
- Entity Framework Core DbContext for database operations
- Configures the Attendance entity with validation and indexes
- Place in: Data/ folder

### 2. *database.sql*
- SQL Server database creation script
- Creates the LibraryAttendanceDB database
- Creates Attendances table with proper schema
- Includes performance indexes on VisitorId and CheckInTime
- Includes sample data for testing

### 3. *appsettings.json*
- Configuration file with database connection string
- Update the connection string if using a different SQL Server instance

### 4. *Startup.cs*
- ASP.NET Core startup configuration
- Registers DbContext with dependency injection
- Configures Entity Framework Core with SQL Server

### 5. *AttendanceControllerUpdated.cs*
- Updated controller using Entity Framework Core
- Removes in-memory storage and uses database instead
- Includes async/await for better performance
- Adds API endpoints for retrieving records

## Setup Instructions

### Step 1: Install NuGet Packages
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer

### Step 2: Create Database (Choose One)

*Option A: Using SQL Server Management Studio*
- Open SSMS
- Run the database.sql script

*Option B: Using Entity Framework Migrations*
dotnet ef migrations add InitialCreate
dotnet ef database update

### Step 3: Update Your Startup
- Replace the existing AttendanceController.cs with AttendanceControllerUpdated.cs
- Or copy the DbContext registration from Startup.cs to your Program.cs

### Step 4: Update Connection String
- Modify appsettings.json if your SQL Server instance name is different
- Use your appropriate server name instead of (localdb)\\mssqllocaldb

## Database Schema

### Attendances Table
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | Primary Key, Identity |
| VisitorName | NVARCHAR(100) | NOT NULL |
| VisitorId | NVARCHAR(50) | NOT NULL |
| Purpose | NVARCHAR(200) | Nullable |
| CheckInTime | DATETIME | NOT NULL |
| CheckOutTime | DATETIME | Nullable |
| CreatedAt | DATETIME | Default GETUTCDATE() |

## Features
- ✅ Persistent data storage
- ✅ Check-in/Check-out tracking
- ✅ Performance indexes
- ✅ Async database operations
- ✅ API endpoints for frontend integration
- ✅ Validation and constraints
- ✅ Sample data included