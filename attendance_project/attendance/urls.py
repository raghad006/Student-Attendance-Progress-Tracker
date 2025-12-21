from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TakeAttendanceViewSet, AttendanceStatsView ,StudentAttendanceView


router = DefaultRouter()
router.register(r"take", TakeAttendanceViewSet, basename="take_attendance")

urlpatterns = [
    path("", include(router.urls)),
    path("stats/<int:course_id>/", AttendanceStatsView.as_view(), name="attendance-stats"),
    path("student/<int:course_id>/", StudentAttendanceView.as_view(), name="student-attendance"),
    
]
