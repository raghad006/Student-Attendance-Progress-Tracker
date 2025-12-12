from django.urls import path
from .views import NotificationListView, MarkNotificationReadView, SendCourseNotificationView

urlpatterns = [
    path("", NotificationListView.as_view(), name="notification-list"),

    path("mark-read/<int:pk>/", MarkNotificationReadView.as_view(), name="mark-notification-read"),

    path("send-course/", SendCourseNotificationView.as_view(), name="send-course-notification"),
]
