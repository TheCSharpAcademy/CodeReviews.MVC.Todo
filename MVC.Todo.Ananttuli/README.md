# Todo App

- Full stack app for managing TODOs
- Users can add, delete, update and display TODO details
- TODOs have a title, date and completion status
- Overdue TODOs are highlighted
- TODOs can be checked anytime by clicking the checkbox
- To change the name or due date or completion status, click the pencil icon to edit

## Run Locally (Development)

To run this locally via command line:

- Clone this repository
- `cd TodoApi`
- `dotnet run --launch-profile https`
  - The browser should automatically open (otherwise open `https://localhost:7241` in your browser)
  - The browser should serve the static website at root URI

## Tech Stack

- Backend
  - C# ASP.NET Core Minimal API (+ Swagger & OpenAPI)
  - EF Core + SQLite
- Frontend
  - Single page app in pure JS (no frameworks)

## Notes

- When the application starts, the database & schema should be auto-created if it doesn't exist.
- Configuration for the database connection modifiable in `appsettings.json` (Default should work)
