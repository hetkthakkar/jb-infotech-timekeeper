# JB InfoTech Timekeeper

Build a professional Employee Attendance Management System for JB InfoTech. The backend is ALREADY BUILT using Google Sheets + Google Apps Script. The frontend must communicate with the existing Google Apps Script REST-style web app. The backend uses Google Sheets as the database.

- **Backend**: Google Apps Script Web App (`https://script.google.com/macros/s/AKfycbxVMZUiNvlg_yIx_e2zKfzhWavXpfjfRA8TDdjVILsj1Yy0zlHspOK_ScF83i4J36Ov/exec`)

Existing Apps Script modules:
Code.gs, Utils.gs, Auth.gs, Employees.gs, Shifts.gs, Punch.gs, Attendance.gs, ManualPunch.gs, Leave.gs, Warnings.gs, Payroll.gs, Triggers.gs, Test.gs

The frontend should be designed as a production-style internal company application.
TECHNOLOGY:

- React
- TypeScript
- Tailwind CSS
- Modern component architecture
- Responsive desktop/tablet/mobile UI
- Clean reusable components
- API service layer
- Proper loading, error, and empty states

IMPORTANT: Do not hardcode attendance records, employees, leave records, warnings, or payroll records.
All business data must come from the Apps Script API.

Create a centralized API service so that all backend calls go through one place.

Create:
src/services/api.ts

Store the Apps Script URL in one configuration constant/environment variable rather than duplicating it throughout the application.

The UI should be professional, clean, modern, and suitable for an internal HR/attendance application. Use a light professional interface. Do not add dark mode.

Create the application foundation first:- App shell

- Sidebar

- Header

- Routing

- API service layer

- Authentication state

- Global loading/error handling

- Toast notifications

- Reusable tables

- Reusable cards

- Reusable modal/dialog

- Reusable confirmation dialog

Do not implement all business pages yet.

First create the architecture and shell.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5c92456b-e1c3-4370-9680-e3024be21c95).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
