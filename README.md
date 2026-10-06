# DentalBot Dashboard 🦷

A React-based dashboard for **DentalBot**, a multi-tenant missed-call recovery platform for dental clinics.

The dashboard allows authenticated clinic staff to monitor patient leads, review lead statuses, confirm appointments, dismiss leads, and view appointment information through a clean clinic management interface.

---

## ✨ Features

- 🔐 JWT-based authentication
- 🏥 Clinic-specific dashboard
- 📊 Dashboard overview
- 👥 Patient lead management
- 📅 Appointment management
- ✅ Lead confirmation
- ❌ Lead dismissal
- 💬 WhatsApp lead information
- 🔒 Protected routes
- 🚪 Logout functionality
- 🔄 Automatic authentication handling
- ⚡ Axios API integration
- 🎨 Responsive clinic dashboard UI
- 🧩 Reusable React components
- 📱 React Router navigation
- 🎯 Status badges for leads and appointments
- ⚠️ Form validation and error handling

---

# 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend Framework | React |
| Build Tool | Vite |
| Language | JavaScript / JSX |
| HTTP Client | Axios |
| Routing | React Router |
| Icons | Lucide React |
| Styling | CSS |
| Authentication | JWT |
| Backend Integration | Spring Boot REST API |
| Storage | Browser Local Storage |

---

# 🏗️ Frontend Architecture

```text
React Application
│
├── Authentication
│   ├── AuthContext
│   └── ProtectedRoute
│
├── API Layer
│   └── Axios Client
│
├── Layout
│   ├── Sidebar
│   └── Navigation
│
├── Pages
│   ├── Login
│   ├── Dashboard
│   ├── Leads
│   └── Appointments
│
└── Reusable Components
    ├── Modal
    └── StatusBadge
```

---

# 📁 Project Structure

```text
dentalbot-dashboard/
│
├── src/
│   ├── api/
│   │   └── client.js
│   │
│   ├── auth/
│   │   ├── AuthContext.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── Modal.jsx
│   │   └── StatusBadge.jsx
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── LeadsPage.jsx
│   │   └── AppointmentsPage.jsx
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── public/
│
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

# 🔐 Authentication

The dashboard uses JWT authentication provided by the DentalBot backend.

After a successful login, the JWT is stored in browser Local Storage.

The token is stored under:

```text
dentalbot_token
```

The clinic name is cached under:

```text
dentalbot_clinic_name
```

---

## Authentication Flow

```text
User
 │
 ▼
Login Page
 │
 │ email + password
 ▼
POST /api/v1/auth/login
 │
 ▼
Backend
 │
 ▼
JWT Token
 │
 ▼
Local Storage
 │
 ▼
AuthContext
 │
 ▼
Protected Dashboard
```

---

# 🔑 Login

The login page provides:

- Email input
- Password input
- Form validation
- Loading state
- Error handling
- Automatic navigation after successful login

### Backend Endpoint

```http
POST /api/v1/auth/login
```

Example request:

```json
{
  "email": "you@clinic.com",
  "password": "your-password"
}
```

The returned JWT token is stored in:

```text
localStorage.dentalbot_token
```

---

# 🔒 Protected Routes

The application uses a reusable `ProtectedRoute` component.

Protected routes include:

```text
/dashboard
/leads
/appointments
```

If a user is not authenticated, they are redirected to:

```text
/login
```

### Route Flow

```text
                    ┌── /dashboard
                    │
/login ── Login ────┼── /leads
                    │
                    └── /appointments
                         │
                         ▼
                   ProtectedRoute
                         │
                ┌────────┴────────┐
                │                 │
             Token              No Token
                │                 │
                ▼                 ▼
             Allow             /login
```

---

# 🌐 API Integration

Axios is used as the HTTP client.

The API client is configured with:

```text
http://localhost:8080/api/v1
```

The Axios client automatically adds the JWT token to authenticated requests.

### Authorization Header

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 🔄 Axios Interceptors

The API client uses request and response interceptors.

## Request Interceptor

Before each request:

```text
Read JWT from Local Storage
        │
        ▼
If token exists
        │
        ▼
Add Authorization header
        │
        ▼
Send request
```

---

## Response Interceptor

If the backend returns:

```http
401 Unauthorized
```

the frontend:

1. Removes the stored JWT
2. Removes the cached clinic name
3. Redirects the user to `/login`

This prevents the application from continuing with an expired or invalid authentication token.

---

# 🧭 Navigation

The dashboard contains a sidebar with:

- Dashboard
- Leads
- Appointments
- Log out

The sidebar also displays the clinic name retrieved after login.

---

# 📊 Dashboard

### Route

```text
/dashboard
```

The dashboard provides an overview of clinic activity.

### Dashboard Statistics

The following metrics are displayed:

```text
Total Leads
Awaiting Confirmation
Confirmed
Dismissed
```

The dashboard also displays recent leads.

---

## Dashboard API

```http
GET /api/v1/dashboard
```

Example response structure:

```json
{
  "totalLeads": 25,
  "awaitingReplyCount": 5,
  "collectingDetailsCount": 4,
  "awaitingConfirmationCount": 3,
  "confirmedCount": 10,
  "dismissedCount": 3,
  "todaysAppointments": [],
  "recentLeads": []
}
```

---

# 👥 Leads

### Route

```text
/leads
```

The Leads page displays patient inquiries captured through WhatsApp.

Each lead can display:

```text
Patient
Phone
Service
Preferred Time
Status
Actions
```

---

## Lead Statuses

The frontend supports the following statuses:

| Status | Display |
|---|---|
| `AWAITING_REPLY` | Awaiting Reply |
| `COLLECTING_DETAILS` | Collecting Details |
| `AWAITING_CONFIRMATION` | Awaiting Confirmation |
| `CONFIRMED` | Confirmed |
| `DISMISSED` | Dismissed |

The frontend also supports appointment-related statuses:

| Status | Display |
|---|---|
| `COMPLETED` | Completed |
| `CANCELLED` | Cancelled |

---

# 🎯 Lead Actions

Actions are displayed for leads with:

```text
AWAITING_CONFIRMATION
```

The available actions are:

```text
Confirm
Dismiss
```

---

# ✅ Confirm Appointment

Clicking **Confirm** opens an appointment confirmation modal.

The modal contains:

```text
Patient Name
Service
Scheduled Date & Time
```

The patient name and service are pre-filled from the lead when available.

---

## Confirmation Validation

Before submitting:

- Patient name must be provided
- Service must be provided
- Appointment date/time must be provided
- Appointment time must be in the future

The frontend also sends the scheduled date/time to the backend in ISO-compatible format.

### Backend Endpoint

```http
POST /api/v1/leads/{id}/confirm
```

Example request:

```json
{
  "patientName": "Rahul Sharma",
  "service": "Dental Cleaning",
  "scheduledAt": "2026-10-10T11:00:00"
}
```

After successful confirmation, the leads list is refreshed.

---

# ❌ Dismiss Lead

A lead can be dismissed from the Leads page.

Before dismissal, the user receives a confirmation prompt.

### Backend Endpoint

```http
POST /api/v1/leads/{id}/dismiss
```

After successful dismissal, the leads list is refreshed.

---

# 📅 Appointments

### Route

```text
/appointments
```

The Appointments page displays confirmed patient appointments.

Each appointment displays:

```text
Patient
Service
Scheduled
Status
```

---

## Appointment API

```http
GET /api/v1/appointments
```

The frontend retrieves appointments from the backend and formats the scheduled date/time using the `en-IN` locale.

Example:

```text
10 Oct 2026, 11:00 am
```

---

# 📋 Empty States

The frontend provides empty states when no data is available.

### Dashboard

```text
No leads yet.
New patient conversations will appear here.
```

### Leads

```text
No leads yet.
When a patient messages your clinic on WhatsApp, they'll show up here.
```

### Appointments

```text
No confirmed appointments yet.
```

---

# ⚠️ Error Handling

The frontend handles API errors through:

- Axios response handling
- Error banners
- Login error messages
- Confirmation form errors
- Dashboard loading errors
- Appointment loading states
- Lead loading states
- Dismissal error alerts
- Automatic redirect on `401 Unauthorized`

---

# ⏳ Loading States

Loading indicators are displayed while API requests are in progress.

Examples:

```text
Loading dashboard...
Loading leads...
Loading appointments...
Logging in...
Confirming...
```

The login button also displays a loading spinner while authentication is in progress.

---

# 🧩 Reusable Components

## Layout

The `Layout` component provides the main authenticated application shell.

It contains:

```text
Sidebar
Navigation
Clinic Name
Logout Button
Main Content
```

---

## StatusBadge

The `StatusBadge` component provides a consistent visual representation of lead and appointment statuses.

Each status has:

```text
Label
Text Color
Background Color
Status Dot
```

Example:

```text
● Confirmed
● Awaiting Confirmation
● Dismissed
```

---

## Modal

The reusable `Modal` component provides:

- Modal overlay
- Modal title
- Close button
- Click-outside-to-close behavior
- Custom child content

It is currently used for appointment confirmation.

---

# 🎨 UI Design

The dashboard uses a clean clinic-management interface with:

- Teal primary color
- White cards
- Light gray background
- Rounded components
- Status badges
- Sidebar navigation
- Data tables
- Modal dialogs
- Loading states
- Error banners

The UI uses:

```text
Inter
```

as the primary font.

Icons are provided by:

```text
Lucide React
```

---

# 🖥️ Pages

The application currently contains four main pages.

| Page | Route | Purpose |
|---|---|---|
| Login | `/login` | Authenticate clinic staff |
| Dashboard | `/dashboard` | View clinic overview |
| Leads | `/leads` | Manage patient leads |
| Appointments | `/appointments` | View confirmed appointments |

---

# 🗺️ Route Configuration

The frontend uses React Router.

Current routes:

```text
/login
/dashboard
/leads
/appointments
```

Any unknown route is redirected to:

```text
/dashboard
```

---

# 🔄 Complete User Flow

```text
Open Application
       │
       ▼
   /login
       │
       ▼
Enter Email + Password
       │
       ▼
POST /auth/login
       │
       ▼
JWT Received
       │
       ▼
Token Stored in Local Storage
       │
       ▼
Fetch Clinic Information
       │
       ▼
Navigate to Dashboard
       │
       ├───────────────┐
       │               │
       ▼               ▼
   Dashboard         Leads
       │               │
       │               ├── Confirm
       │               │
       │               └── Dismiss
       │
       ▼
Appointments
       │
       ▼
View Confirmed Appointments
```

---

# 🔗 Backend Integration

The frontend communicates with the DentalBot Spring Boot backend.

### Backend Base URL

```text
http://localhost:8080/api/v1
```

### Main APIs Used

| Frontend Feature | HTTP Method | Backend Endpoint |
|---|---|---|
| Login | POST | `/auth/login` |
| Clinic Information | GET | `/clinic` |
| Dashboard | GET | `/dashboard` |
| Leads | GET | `/leads` |
| Confirm Lead | POST | `/leads/{id}/confirm` |
| Dismiss Lead | POST | `/leads/{id}/dismiss` |
| Appointments | GET | `/appointments` |

---

# ⚙️ Prerequisites

Before running the dashboard, make sure you have:

- Node.js
- npm
- DentalBot backend running
- PostgreSQL running through the backend setup

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

---

# ▶️ Running the Frontend Locally

## 1. Clone the Repository

```bash
git clone <YOUR_FRONTEND_GITHUB_REPOSITORY_URL>
cd dentalbot-dashboard
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start the Development Server

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

Typically:

```text
http://localhost:5173
```

---

# 🔌 Backend Requirement

The frontend expects the DentalBot backend to be running at:

```text
http://localhost:8080
```

The backend should expose:

```text
/api/v1/auth/login
/api/v1/clinic
/api/v1/dashboard
/api/v1/leads
/api/v1/appointments
```

Start the backend before using the dashboard.

---

# 🌐 CORS

The backend must allow the frontend development origin.

The current backend configuration allows:

```text
http://localhost:5173
```

Therefore, the standard local setup is:

```text
Frontend
http://localhost:5173
        │
        │ REST API
        ▼
Backend
http://localhost:8080
        │
        ▼
PostgreSQL
```

---

# 🔐 Local Storage

The application stores authentication-related information in browser Local Storage.

### JWT

```text
dentalbot_token
```

### Clinic Name

```text
dentalbot_clinic_name
```

These values are removed when the user logs out.

They are also removed automatically when the backend returns:

```http
401 Unauthorized
```

---

# 🚪 Logout

When the user clicks **Log out**:

```text
Remove JWT
     │
     ▼
Remove Clinic Name
     │
     ▼
Clear AuthContext State
     │
     ▼
Navigate to /login
```

---

# 📦 Build for Production

Create a production build using:

```bash
npm run build
```

The generated production files are placed in:

```text
dist/
```

---

# 🔍 Preview Production Build

After building:

```bash
npm run preview
```

Vite will provide a local preview URL.

---

# 🧪 Development Workflow

A typical development workflow is:

```text
1. Start PostgreSQL
        ↓
2. Start Spring Boot Backend
        ↓
3. Start React/Vite Frontend
        ↓
4. Open Dashboard
        ↓
5. Login
        ↓
6. View Dashboard
        ↓
7. Manage Leads
        ↓
8. Confirm/Dismiss Leads
        ↓
9. View Appointments
```

---

# 🧪 Testing the Dashboard

A basic manual testing flow:

### 1. Login

Open:

```text
http://localhost:5173/login
```

Enter valid clinic credentials.

---

### 2. Dashboard

Verify:

```text
Total Leads
Awaiting Confirmation
Confirmed
Dismissed
Recent Leads
```

---

### 3. Leads

Navigate to:

```text
/leads
```

Verify:

```text
Patient
Phone
Service
Preferred Time
Status
Actions
```

---

### 4. Confirm a Lead

For an `AWAITING_CONFIRMATION` lead:

```text
Click Confirm
      ↓
Enter appointment details
      ↓
Submit
      ↓
Backend confirms lead
      ↓
Leads list refreshes
```

---

### 5. Dismiss a Lead

```text
Click Dismiss
      ↓
Confirm action
      ↓
Backend dismisses lead
      ↓
Leads list refreshes
```

---

### 6. Appointments

Navigate to:

```text
/appointments
```

Verify confirmed appointments appear in the table.

---

# 📱 Responsive Behavior

The application includes responsive styling for smaller screens.

The layout adapts components such as:

- Sidebar
- Dashboard statistics
- Navigation
- Content sections
- Next-step sections

for smaller viewport sizes.

---

# 🧱 Component Architecture

```text
App
│
├── AuthProvider
│
├── BrowserRouter
│
└── Routes
    │
    ├── LoginPage
    │
    ├── ProtectedRoute
    │     ├── DashboardPage
    │     ├── LeadsPage
    │     └── AppointmentsPage
    │
    └── Navigate
```

Authenticated pages use:

```text
Layout
│
├── Sidebar
│   ├── Dashboard
│   ├── Leads
│   ├── Appointments
│   └── Logout
│
└── Main Content
```

---

# 📌 Key Frontend Design Decisions

### Centralized API Client

All backend requests use a shared Axios client.

```text
src/api/client.js
```

This keeps:

- Base URL
- JWT handling
- Unauthorized handling

in one place.

---

### Centralized Authentication

Authentication state is managed using:

```text
AuthContext
```

This allows different components to access:

```text
token
clinicName
login()
logout()
```

without manually passing authentication state through multiple component levels.

---

### Protected Routing

Authenticated pages are wrapped with:

```text
ProtectedRoute
```

so unauthenticated users are redirected to the login page.

---

### Reusable UI Components

Common UI elements are extracted into reusable components:

```text
Layout
Modal
StatusBadge
```

This avoids duplicating the same UI logic across pages.

---

# 📈 Future Improvements

Potential frontend improvements include:

- Clinic registration UI
- Clinic profile/settings page
- Patient conversation viewer
- Individual lead details page
- Search and filtering for leads
- Lead pagination
- Appointment filtering
- Appointment cancellation
- Appointment rescheduling
- Toast notifications
- Better mobile navigation
- Refresh token handling
- Environment-based API configuration
- Production deployment
- Automated frontend tests
- End-to-end testing
- Accessibility improvements
- Dark mode
- Analytics dashboard
- Real-time dashboard updates

---

# 🔒 Security Notes

The frontend should never contain:

```text
JWT signing secrets
Twilio credentials
Database passwords
Backend private keys
```

The frontend only stores the JWT returned by the backend.

Backend secrets must remain on the server.

---

# ⚠️ Production Configuration

The current API client uses:

```text
http://localhost:8080/api/v1
```

For production deployment, the API base URL should be configured using an environment variable rather than hardcoded.

For example:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api/v1
```

Then the Axios client can use the environment variable.

---

# 📝 Environment Variables

The current frontend code does not require a `.env` file because the API base URL is currently defined directly in the Axios client.

For production, it is recommended to use:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

and configure Axios using:

```javascript
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
```

Do not place backend secrets in frontend environment variables.

Anything exposed through a Vite frontend build should be treated as publicly accessible.

---

# 🧩 API Request Flow

Example: loading leads.

```text
LeadsPage
    │
    ▼
client.get('/leads')
    │
    ▼
Axios Request Interceptor
    │
    ▼
Read dentalbot_token
    │
    ▼
Add Authorization Header
    │
    ▼
Spring Boot Backend
    │
    ▼
JWT Authentication
    │
    ▼
Clinic-scoped Lead Query
    │
    ▼
JSON Response
    │
    ▼
LeadsPage
    │
    ▼
Render Table
```

---

# 🎯 Project Purpose

The DentalBot Dashboard provides the clinic-facing interface for the DentalBot missed-call recovery platform.

It connects the clinic staff to the backend system that manages:

```text
Patient Leads
      +
WhatsApp Conversations
      +
Lead Confirmation
      +
Appointments
      +
Clinic Dashboard
```

The frontend focuses on providing a simple interface for clinic staff to manage the patient leads generated by the DentalBot backend.

---

# 🔗 Related Backend

This frontend is designed to work with the DentalBot Spring Boot backend.

Backend repository:

```text
<YOUR_BACKEND_GITHUB_REPOSITORY_URL>
```

---

# 👩‍💻 Author

**Riya Nikam**

Electronics & Communication Engineering

---

# ⭐ Project Summary

DentalBot Dashboard is a React/Vite frontend for a multi-tenant dental clinic SaaS platform.

```text
React
  +
Vite
  +
Axios
  +
React Router
  +
JWT Authentication
  +
Spring Boot REST API
```

The dashboard provides clinic staff with a centralized interface for:

```text
Authentication
     ↓
Dashboard
     ↓
Lead Management
     ↓
Appointment Confirmation
     ↓
Appointment Management
```

Built as part of the DentalBot full-stack project.