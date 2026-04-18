#  Fitness Tracker App

A modern, responsive full-stack application designed to help users track their workout plans, execute sessions, and monitor their fitness progress. Built with a robust FastAPI backend and a high-performance React frontend.

## Key Features

*   **User Authentication**: Secure JWT-based registration and login system.
*   **Workout Management**:
    *   Create and manage custom **Workout Plans**.
    *   Design specific training days within each plan.
    *   Add exercises with details like sets, reps, and weight.
*   **Workout Execution**:
    *   Interactive training mode with a session timer.
    *   Real-time set tracking (complete/incomplete).
    *   Note-taking for individual sessions.
*   **Progress Tracking**:
    *   Comprehensive workout history.
    *   Dashboard with statistics and recent activity.
*   **UI/UX**:
    *   Responsive design for mobile and desktop.
    *   Dark/Light mode support.
    *   Smooth animations and transitions.

## Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (via Motor - Asynchronous driver)
- **Validation**: Pydantic v2
- **Security**: JWT Authentication (python-jose, bcrypt)
- **Logging**: Loguru

### Frontend
- **Library**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Navigation**: React Router 7

---

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB instance (Atlas or local)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file and configure (see .env.example if available)
# Key variables: MONGODB_URI, SECRET_KEY
```

**Run Backend:**
```bash
uvicorn app.main:app --reload
# Server starts at http://localhost:8000
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Create .env file
# Ensure VITE_API_URL matches backend (e.g., http://localhost:8000/api/v1)
```

**Run Frontend:**
```bash
npm run dev
# App starts at http://localhost:5173
```

---

## Project Structure

### Backend
```text
Backend/
├── app/
│   ├── core/         # Config and security
│   ├── db/           # MongoDB connection
│   ├── models/       # Beanie/Pydantic models
│   ├── routers/      # API endpoints
│   ├── schemas/      # Input/Output validation
│   ├── services/     # Business logic
│   └── main.py       # Entry point
└── requirements.txt
```

### Frontend
```text
Frontend/
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Application views
│   ├── store/        # Zustand state
│   ├── types/        # TypeScript interfaces
│   └── App.tsx       # Main component
└── tailwind.config.js
```

## License
This project is for educational purposes. Feel free to use and modify it as you see fit.

## Live Demo
Coming soon...
