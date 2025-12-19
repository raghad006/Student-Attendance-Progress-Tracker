from django.urls import path
from .views import (
    NotificationListView,
    MarkNotificationReadView,
    SendCourseNotificationView,
    MarkAllReadView,
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notifications-list'),
    path('<int:pk>/mark-read/', MarkNotificationReadView.as_view(), name='notification-mark-read'),
    path('send-course/', SendCourseNotificationView.as_view(), name='notification-send-course'),
    path('mark-all-read/', MarkAllReadView.as_view(), name='notifications-mark-all-read'),
]
