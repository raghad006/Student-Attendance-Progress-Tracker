from django.contrib import admin
from django.urls import path, include
from accounts.views import test_view

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
    path("test/", test_view, name="test"),
    path("api/students/", include("students.urls")),
    path("api/attendance/", include("attendance.urls")),
    path("api/notifications/", include("notifications.urls")),

]
