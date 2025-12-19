from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from notifications.models import Notification
from notifications.serializers import NotificationSerializer
from students.models import Course, StudentData

User = get_user_model()


class NotificationModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="student",
            email="student@example.com",
            password="pass"
        )
        self.sender = User.objects.create_user(
            username="teacher",
            email="teacher@example.com",
            password="pass"
        )
        self.course = Course.objects.create(title="Test Course", teacher=self.sender)

    def test_notification_creation(self):
        notification = Notification.objects.create(
            user=self.user,
            sender=self.sender,
            title="Hello",
            message="Test message",
            course=self.course
        )
        self.assertEqual(notification.user, self.user)
        self.assertEqual(notification.sender, self.sender)
        self.assertEqual(notification.course_title, self.course.title)
        self.assertFalse(notification.is_read)

    def test_notification_serializer(self):
        notification = Notification.objects.create(
            user=self.user,
            title="Test",
            message="Hello"
        )
        serializer = NotificationSerializer(notification)
        data = serializer.data
        self.assertEqual(data["title"], "Test")
        self.assertEqual(data["message"], "Hello")
        self.assertEqual(data["sender"], "System")


class NotificationAPIViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.sender = User.objects.create_user(
            username="teacher",
            email="teacher@example.com",
            password="pass"
        )
        self.student_user = User.objects.create_user(
            username="student",
            email="student@example.com",
            password="pass"
        )
        self.course = Course.objects.create(title="Math", teacher=self.sender)
        StudentData.objects.create(student=self.student_user).courses.add(self.course)

    def get_token(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def test_mark_notification_read_view(self):
        token = self.get_token(self.student_user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        notification = Notification.objects.create(
            user=self.student_user, title="Test", message="Hello"
        )
        url = reverse("notification-mark-read", kwargs={"pk": notification.id})
        response = self.client.post(url)
        notification.refresh_from_db()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(notification.is_read)

    def test_send_course_notification_view(self):
        token = self.get_token(self.sender)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        url = reverse("notification-send-course")
        response = self.client.post(url, {
            "course_id": self.course.id,
            "message": "Hello Students"
        })
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Notification.objects.filter(
            user=self.student_user, message="Hello Students"
        ).exists())
        self.assertTrue(Notification.objects.filter(
            user=self.sender, message="Hello Students"
        ).exists())
    def test_sent_notification_list_view(self):
        token = self.get_token(self.sender)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        Notification.objects.create(
        user=self.student_user, sender=self.sender, title="Test", message="Hello"
    )

        url = reverse("notifications-sent")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        data = [d for d in data if d["title"] == "Test"]

        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["title"], "Test")