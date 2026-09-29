# Employee Visitor Registration System (MERN Stack)

A clean, modern digital reception logbook that replaces paper registers in company offices and institutions.

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM

---

## Features
- **Register Visitor**:
  - Full Name
  - Mobile Number (10 digits)
  - Company / College Name
  - Person to Meet (Host)
  - Purpose of Visit (Meeting, Interview, Discussion, Delivery, etc.)
  - Auto Date & Time (timestamped on registration)
- **View All Records**: Clean, responsive table showing all active and checked-out visitors.
- **Real-Time Search**: Search instantly by **Visitor Name** or **Mobile Number**.
- **Edit Visitor**: Easily edit visitor details.
- **Check-Out**: Mark visitors as checked out with a single click.
- **Delete Record**: Remove unwanted or test entries.
- **Dashboard Stats**: Shows **Today's Total Visitors**, **Currently In Premises**, and **Total Records**.
- **Export to CSV**: Export the entire visitor log to a `.csv` file.
- **No Mock Data**: Real database integration with zero fake demo records.

---

## Project Structure
```
employee/
├── backend/
│   ├── models/
│   │   ├── User.js            # Reception staff auth model
│   │   └── Visitor.js         # Visitor registration schema
│   ├── routes/
│   │   ├── authRoutes.js      # Login and signup endpoints
│   │   └── visitorRoutes.js   # Visitor REST API endpoints
│   ├── .env                   # PORT & MONGODB_URI
│   ├── server.js              # Express app entrypoint
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthPage.jsx     # Staff Login & Sign-up page
│   │   │   ├── Navbar.jsx       # Header with live stats, user profile & logout
│   │   │   ├── VisitorTable.jsx # Responsive table with search & actions
│   │   │   └── VisitorModal.jsx # Clean Add/Edit popup form
│   │   ├── services/
│   │   │   └── exportService.js # CSV export utility
│   │   ├── utils/
│   │   │   └── dateUtils.js     # Date formatting helpers
│   │   ├── App.jsx              # Main dashboard component
│   │   └── main.jsx
│   ├── .env                     # VITE_API_URL
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── start.bat                  # One-click launcher
└── README.md
```

---

## How to Run

### Prerequisites
- Node.js installed
- MongoDB (Connected to MongoDB Atlas or local MongoDB instance)

### Quick Start (Recommended)
Double-click `start.bat` in the root folder, or run:
```bash
.\start.bat
```
This automatically launches both the backend and frontend in separate command windows.

### Manual Start

#### 1. Start the Backend
```bash
cd backend
npm start
```
> Server runs on: `http://localhost:5000`

#### 2. Start the Frontend
```bash
cd frontend
npm run dev
```
> App opens at: `http://localhost:5173`

---

## MongoDB Atlas IP Whitelist Note

If using MongoDB Atlas (`cluster0.cfwcfzh.mongodb.net`):
1. Log in to [cloud.mongodb.com](https://cloud.mongodb.com).
2. Go to **Network Access** in the left sidebar.
3. Click **Add IP Address** -> Choose **Allow Access from Anywhere** (`0.0.0.0/0`) -> Click **Confirm**.
4. *(Fallback)* If Atlas cannot be reached, the server automatically connects to local MongoDB at `mongodb://127.0.0.1:27017/visitor_db` so the system never breaks.

---

## REST API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register new reception staff account |
| `POST` | `/api/auth/login` | Login reception staff (returns JWT & user profile) |

### Visitors
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/visitors` | List all visitors (supports `?search=query`) |
| `POST` | `/api/visitors` | Register a new visitor |
| `PUT` | `/api/visitors/:id` | Update visitor details |
| `PATCH` | `/api/visitors/:id/checkout` | Check out visitor (sets `checkOutTime`) |
| `DELETE` | `/api/visitors/:id` | Delete visitor record |
