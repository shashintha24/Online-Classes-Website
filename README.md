# Online Class & Attendance Management System

## Overview

The **Online Class & Attendance Management System** is a web-based application designed to help educational institutions manage online classes and track student attendance efficiently. The system allows teachers to create and manage classes, students to join sessions, and administrators to monitor attendance records and system activities.

This application is built using modern web technologies including React for the frontend, Node.js for the backend, and PostgreSQL for database management.

---

## Technologies Used

### Frontend

* React
* HTML5
* CSS3
* JavaScript
* Axios

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### Development Tools

* Node Package Manager (npm)
* Git & GitHub
* Vite (for React development)

---

## System Features

### Student Features

* Register and log in to the system
* View available classes
* Join online sessions
* Mark attendance
* View personal attendance records

### Teacher Features

* Create and manage classes
* Schedule online sessions
* Monitor student attendance
* Generate attendance reports

### Administrator Features

* Manage users (students and teachers)
* Manage class information
* View overall system statistics
* Maintain database records

---

## Project Structure

```
online-class-attendance-system
│
├── frontend
│   ├── public
│   └── src
│       ├── components
│       ├── pages
│       ├── services
│       ├── App.jsx
│       └── main.jsx
│
├── backend
│   ├── config
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middleware
│   └── server.js
│
├── database
│   ├── schema.sql
│   └── seed.sql
│
└── README.md
```

---

## Installation Guide

### 1. Clone the Repository

```
git clone https://github.com/yourusername/online-class-attendance-system.git
cd online-class-attendance-system
```

### 2. Install Backend Dependencies

```
cd backend
npm install
```

### 3. Install Frontend Dependencies

```
cd ../frontend
npm install
```

---

## Running the Application

### Start Backend Server

```
cd backend
node server.js
```

### Start Frontend Application

```
cd frontend
npm run dev
```

The frontend will typically run on:

```
http://localhost:5173
```

The backend API will run on:

```
http://localhost:5000
```

---

## Database Setup

1. Install PostgreSQL
2. Create a database named:

```
attendance_system
```

3. Run the schema file:

```
database/schema.sql
```

This will create tables for:

* Users
* Classes
* Attendance

---

## Future Improvements

* QR code based attendance system
* Face recognition attendance
* Email notifications
* Real-time class updates
* Mobile responsive UI

---

## Contribution

Contributions are welcome. If you would like to improve the project, feel free to fork the repository and submit a pull request.

---

## License

This project is developed for educational purposes and can be modified or extended for academic or research use.

---

## Author

Developer: Your Name
Project: Online Class & Attendance Management System
