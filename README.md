# Access Control System with Role Matrix

This is a full-stack application featuring Role-Based Access Control (RBAC) with a dynamic Permission Matrix.

## Tech Stack

*   **Backend**: NestJS, MongoDB (Mongoose), Passport, JWT
*   **Frontend**: React, Vite, Tailwind CSS, Axios

## Prerequisites

*   [Node.js](https://nodejs.org/) (v14+)
*   [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on default port `27017`.

## Getting Started

### 1. Backend Setup

The backend runs on port `5000`.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run start:dev
    ```

**Note**: The application will automatically seed default roles (`Admin`, `Manager`, `User`) and permissions upon first startup.

### 2. Frontend Setup

The frontend runs on port `3000`.

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

### 3. Usage

1.  Open your browser and go to `http://localhost:3000`.
2.  **Register** a new user.
3.  **Login** with your credentials.
4.  If you are an **Admin**, you can manage permissions via the "Permission Matrix" page.

## Default Roles & Permissions

*   **Admin**: Has all permissions (Manage Roles, Manage Permissions, View Users, Delete Users, View Dashboard).
*   **Manager**: Can view dashboard (default).
*   **User**: Can view dashboard (default).

## Environment Variables

**Backend (`/backend/.env`)**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/access-control-system
JWT_SECRET=supersecretkey123
JWT_EXPIRATION=1d
```
