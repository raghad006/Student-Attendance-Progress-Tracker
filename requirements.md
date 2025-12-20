# Student Attendance Management System (SAMS)

## Problem Statement
In many universities, attendance tracking is still handled manually or using fragmented systems that are inefficient, error-prone, and time-consuming. Students often lack real-time visibility into their attendance percentage, while teachers struggle with managing large class attendance records accurately. Administrative staff also face difficulties managing users and permissions without technical intervention.

## Proposed Solution
The Attendance Tracker is a web-based system that provides an integrated platform for students, teachers, and administrators to manage attendance efficiently. The system automates attendance recording, calculation, reporting, and user management, ensuring accuracy, transparency, and ease of use.

## Why the System Is Needed
- Manual attendance leads to mistakes and data loss  
- Students need instant access to attendance status and grades  
- Teachers require fast and reliable tools for marking attendance  
- Admins need a simple way to manage users without coding  
- Universities need a scalable and secure digital solution  

## Target Users
- **Students:** View attendance, courses, grades, and alerts  
- **Teachers:** Manage courses, mark attendance, view student performance  
- **Administrators:** Manage users, roles, and system access  

## Main Goal of the System
To provide a centralized, secure, and user-friendly attendance management system that:  
- Tracks attendance automatically  
- Calculates attendance percentages and grades  
- Improves transparency between students and teachers  
- Reduces administrative workload  

## Platform
Web Application

## Technology Stack 
- Frontend: React.js  
- Backend: Django + Django REST Framework  
- Authentication: JWT (JSON Web Tokens)  
- Database: MySQL / SQLite  
- Admin Panel: Django Admin  

---
## Continuous Integration (CI) & Automation
### CI Tools & Configuration
- CI Platform: GitHub Actions
- Configuration Format: YAML
- Backend Framework: Django
- Frontend Framework: React.js
- Database (CI Environment): MySQL

### Authentication CI
#### Functional Requirements

- The system shall automatically trigger the Authentication CI pipeline on push or pull request to the Authentication branch.
- The system shall create a temporary MySQL database for authentication testing.
- The system shall install backend dependencies automatically.
- The system shall run database migrations before executing authentication tests.
- The system shall execute automated tests for the accounts module
#### Non-Functional Requirements

- The CI pipeline shall ensure isolation between test and production databases.
- The system shall use environment variables to manage sensitive data.
- The pipeline shall fail if any authentication test fails.

### Frontend CI
#### Functional Requirements

- The system shall automatically trigger the Frontend CI pipeline on push or pull request to the student_dashboard branch.
- The system shall install frontend dependencies using Node.js.
- The system shall build the React application to verify frontend correctness.
- The pipeline shall fail if the build process fails.

#### Non-Functional Requirements

- The CI pipeline shall ensure frontend build consistency.
- The system shall detect frontend errors early.
- The build process shall be reproducible across environments.

### Student Dashboard CI
#### Functional Requirements

- The system shall trigger a backend CI pipeline for the Student Dashboard module.
- The system shall provision a MySQL service for backend testing.
- The system shall run database migrations before executing tests.
- The system shall execute automated tests for the students module.

#### Non-Functional Requirements

- The CI pipeline shall validate student-related backend features.
- The system shall ensure database integrity during tests.
- The pipeline shall prevent regressions in student dashboard functionality.
# Project Requirements

## Functional Requirements

### Authentication & User Management
- The system shall allow users to log in using email or username.  
- The system shall authenticate users using JWT tokens.  
- The system shall redirect users based on their role (Student / Teacher).  
- The system shall allow users to securely log out.  
- The system shall allow administrators to create, edit, and delete users.  

### Student Features
- The system shall display a student dashboard showing enrolled courses.  
- The system shall show attendance percentage for each course.  
- The system shall calculate grades based on attendance.  
- The system shall display past attendance records (Present / Absent / Late).  
- The system shall display today's attendance summary.  
- The system shall allow students to view detailed course information.  

### Teacher Features
- The system shall display a teacher dashboard with assigned courses.  
- The system shall allow teachers to view all students in a course.  
- The system shall allow teachers to mark attendance by date.  
- The system shall support attendance statuses (Present, Absent, Late).  
- The system shall allow teachers to add notes for each student.  
- The system shall support bulk actions such as "Mark All Present".  

### Notifications & Messaging System
- The system shall allow teachers to send notifications to all students enrolled in a specific course.
- The system shall automatically send a welcome notification to students upon successful enrollment in a new course.
- The system shall display notifications on the student dashboard.
- The system shall store notifications for future reference.
- The system shall allow students to mark individual notifications as read.
- The system shall allow students to mark all notifications as read.
- The system shall visually distinguish between read and unread notifications.
- The system shall display the number of unread notifications.

### Admin Features
- The system shall provide an admin dashboard for managing users.  
- The system shall allow role assignment (Student, Teacher, Admin).  
- The system shall provide search and filtering for user records.  

---

## Non-Functional Requirements

### Performance
- The system shall respond to user actions within 2 seconds.  
- The system shall support concurrent users without performance degradation.
- The notification system shall deliver notifications within an acceptable response time.

### Security
- Passwords shall be stored using secure hashing.  
- JWT tokens shall be used for API authentication.  
- Unauthorized users shall not access protected endpoints.
- Notifications shall be accessible only to authorized users.

### Usability
- The system shall have a clean and intuitive user interface.  
- The system shall support responsive design for different screen sizes.  

### Availability
- The system shall be available 24/7 except during scheduled maintenance.  

### Maintainability
- The system shall follow modular architecture.  
- Code shall be readable and documented.
- The system shall use automated CI pipelines to improve maintainability and code quality.
 
---

## Constraints
- Project must be completed within the university semester timeline.  
- Development tools must comply with university guidelines.  
- Team size is limited (solo or small team).  
- Internet connection is required to access the system.

## Scrum Meeting Summaries

### Sprint 1 (Weeks 1–2) – Authentication & CI Setup

**Daily Scrum Summary**
- Discussed progress on authentication implementation.
- Reviewed CI pipeline setup and initial failures.
- Identified merge conflicts and assigned fixes.

**Sprint Review Summary**
- Authentication flow and JWT implementation were reviewed.
- CI workflows for backend and frontend were demonstrated.

**Sprint Retrospective Summary**
- CI configuration took longer than expected.
- Team agreed to improve branch coordination.


### Sprint 2 (Weeks 3–4) – Student Dashboard Development

**Daily Scrum Summary**
- Reviewed student dashboard UI development progress.
- Discussed integration issues between frontend and backend.
- Identified UI styling blockers.

**Sprint Review Summary**
- Student dashboard features were reviewed.
- Navigation and course view functionality were approved.

**Sprint Retrospective Summary**
- Merge conflicts affected development speed.
- Better communication during merges was suggested.


### Sprint 3 (Weeks 5–6) – Database Migration & Backend Integration

**Daily Scrum Summary**
- Discussed database migration progress from SQLite to MySQL.
- Reviewed backend integration tasks.
- Identified MySQL service issues in CI.

**Sprint Review Summary**
- Successful migration to MySQL was demonstrated.
- Backend APIs were verified with the new database.

**Sprint Retrospective Summary**
- CI database setup was challenging.
- Early testing of CI services was recommended.


### Sprint 4 (Weeks 7–8) – Attendance System & Dashboard Enhancements

**Daily Scrum Summary**
- Discussed attendance feature implementation.
- Reviewed dashboard enhancements and UI issues.
- Identified logic issues during attendance saving.

**Sprint Review Summary**
- Attendance marking functionality was demonstrated.
- Dashboard enhancements were reviewed and approved.

**Sprint Retrospective Summary**
- Attendance logic required extra testing.
- Team agreed to increase testing before merges.


### Sprint 5 (Weeks 9–10) – Documentation & Final CI Improvements

**Daily Scrum Summary**
- Reviewed documentation progress and remaining tasks.
- Discussed final CI workflow improvements.
- Confirmed testing status.

**Sprint Review Summary**
- Final documentation and diagrams were reviewed.
- CI pipelines were verified to be stable.

**Sprint Retrospective Summary**
- Project goals were successfully achieved.
- Team collaboration and planning were effective.

# Scrum Sprint Reports

**Project Start Date:** 18-10-2025  
**Project End Date:** 20-12-2025  

## Sprint 1 (Weeks 1–2)
**18-10-2025 – 31-10-2025**  
**Focus:** Authentication & CI Setup  

### Sprint Goal
Deliver a secure authentication system and establish continuous integration workflows.

### Sprint Summary
**Haneen**
- Worked on frontend authentication pages.
- Assisted in resolving merge conflicts.
- Reviewed authentication UI.

**Sara**
- Helped design login/register UI.
- Fixed routing and navigation issues.

**Raghad**
- Set up CI workflows for Authentication, Frontend, and Student Dashboard.
- Implemented backend authentication logic.
- Fixed YAML configuration errors.

**Malak**
- Tested authentication flow.
- Reported validation and edge-case issues.
- Assisted in frontend enhancements (layout adjustments, button alignment).

**Blockers**
- Initial CI failures and merge conflicts (resolved).

## Sprint 2 (Weeks 3–4)
**01-11-2025 – 14-11-2025**  
**Focus:** Student Dashboard Development  

### Sprint Goal
Develop and integrate the student dashboard with stable UI and CI support.

### Sprint Summary
**Haneen**
- Reviewed dashboard UI.
- Fixed integration issues after merges.
- Updated README sections related to dashboard.

**Sara**
- Implemented dashboard UI components.
- Activated “View Course” button.
- Removed non-working UI buttons.

**Raghad**
- Created Student Dashboard CI workflow.
- Fixed CI and branch conflicts.
- Handled dashboard feature merges.

**Malak**
- Tested dashboard navigation.
- Verified UI behavior and reported bugs.
- Implemented frontend improvements (responsive adjustments, styling fixes).


**Blockers**
- UI styling issues and merge conflicts (resolved).

## Sprint 3 (Weeks 5–6)
**15-11-2025 – 28-11-2025**  
**Focus:** Database Migration & Backend Integration  

### Sprint Goal
Migrate the database to MySQL and ensure smooth backend integration.

### Sprint Summary
**Haneen**
- Updated documentation to reflect MySQL migration.
- Reviewed backend integration changes.

**Sara**
- Assisted in frontend adjustments after database changes.
- Tested frontend–backend connectivity.

**Raghad**
- Migrated database from SQLite to MySQL.
- Updated CI workflows to support MySQL.
- Fixed MySQL service issues in GitHub Actions.

**Malak**
- Tested database operations.
- Verified data persistence and API responses.
- Assisted in minor UI fixes to match backend updates.


**Blockers**
- MySQL service readiness in CI (resolved).

## Sprint 4 (Weeks 7–8)
**29-11-2025 – 12-12-2025**  
**Focus:** Attendance System & Dashboard Enhancements  

### Sprint Goal
Implement the attendance system and enhance dashboard functionality.

### Sprint Summary
**Haneen**
- Reviewed attendance feature integration.
- Helped resolve dashboard UI issues.

**Sara**
- Implemented attendance UI.
- Updated dashboard timeline.
- Removed unnecessary “Save All Attendance” button.

**Raghad**
- Developed attendance backend using Django.
- Fixed grade recording errors.
- Integrated attendance APIs.

**Malak**
- Performed functional testing on attendance features.
- Validated data accuracy.
- Assisted with frontend enhancements (attendance table layout, button feedback, responsive display).


**Blockers**
- UI logic issues during attendance saving (resolved).

## Sprint 5 (Weeks 9–10)
**13-12-2025 – 20-12-2025**  
**Focus:** Documentation, Diagrams & Final CI Improvements  

### Sprint Goal
Finalize documentation and ensure CI stability.

### Sprint Summary
**Haneen**
- Created and updated system diagrams (Use Case, Sequence).
- Updated README and requirement documents.
- Fixed diagram links.

**Sara**
- Final UI refinements.
- Assisted in usability testing.

**Raghad**
- Improved CI workflows and branch filtering.
- Fixed remaining YAML issues.
- Ensured stable builds.

**Malak**
- Conducted final testing.
- Verified requirements coverage.
- Assisted in final frontend polish (styling consistency, UI alignment, responsiveness fixes).

**Blockers**
- None 
