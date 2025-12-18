from django.urls import path
from .views import (
    StudentDashboardView,
    TeacherDashboardView,
    CourseListCreateView,
    CourseDetailView,
    EnrollStudentView,
    CourseStudentsView
)

urlpatterns = [
    path("dashboard/", StudentDashboardView.as_view(), name="student_dashboard"),
    path("teacher/dashboard/", TeacherDashboardView.as_view(), name="teacher_dashboard"),
    path("courses/", CourseListCreateView.as_view(), name="course_list_create"),
    path("courses/<int:pk>/", CourseDetailView.as_view(), name="course_detail"),
    path("courses/enroll/", EnrollStudentView.as_view(), name="enroll_student"),
    path("courses/<int:pk>/students/", CourseStudentsView.as_view(), name="course_students"),
]
