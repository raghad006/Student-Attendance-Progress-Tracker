from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TakeAttendanceViewSet

router = DefaultRouter()
router.register(r"take", TakeAttendanceViewSet, basename="take_attendance")

urlpatterns = [
    path("", include(router.urls)),
]

