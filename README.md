
## Overview
A web-based system for managing student attendance efficiently. 
Allows students to track attendance, teachers to mark attendance, and admins to manage users.

## Features
### Students
- View dashboard with enrolled courses
- Check attendance percentage
- See upcoming and past classes

### Teachers
- Mark attendance (Present / Absent / Late)
- View student attendance stats
- Search students in class

### Admins
- Add/Edit/Delete users
- Assign roles (Student / Teacher / Admin)
- Manage system users

## Technology Stack
- Frontend: React.js
- Backend: Django, Django REST Framework
- Authentication: JWT Tokens
- Database: SQLite / PostgreSQL

## Installation
1. Clone the repository: https://github.com/raghad006/Student-Attendance-Progress-Tracker.git
2. Backend:
cd attendance_project
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
3. Frontend:
cd frontend
npm install
npm start

## Folder Structure
attendance_project/
├── frontend/
├── backend/
├── docs/
├── .gitignore
├── LICENSE
└── README.md

## Diagrams
- [Use Case Diagram](docs/diagrams/use_case.png)
- [Class Diagram]![WhatsApp Image 2025-12-01 at 8 38 06 PM](https://github.com/user-attachments/assets/9a50d369-27fa-42a6-9a74-6f24dd36bb9a)

- [Sequence Diagram](Teacher Take Attendance and Add Grades)![WhatsApp Image 2025-12-02 at 12 32 11 PM](https://github.com/user-attachments/assets/bd7892e1-d5bf-486a-a359-8a9ecbfa76d7)

- [Sequence Diagram](Student Login and View Grades & Courses)![WhatsApp Image 2025-12-02 at 12 33 11 PM](https://github.com/user-attachments/assets/c839de04-0d42-49da-bdc2-eb5bb09b9173)

## License
MIT License
