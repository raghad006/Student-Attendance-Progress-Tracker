from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Notification
from .serializers import NotificationSerializer
from students.models import Course
from notifications.CourseSubject import CourseSubject
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

class NotificationListView(APIView):
    def get(self, request):
        notifications = Notification.objects.filter(user=request.user)\
            .exclude(sender=request.user)\
            .order_by("-created_at")
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class MarkNotificationReadView(APIView):
    def post(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk, user=request.user)
            notification.is_read = True
            notification.save()
            return Response({"detail": "Notification marked as read."}, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
class SendCourseNotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        course_id = request.data.get("course_id")
        message = request.data.get("message")
        title = request.data.get("title", "Notification")
        sender = request.user

        if not course_id or not message:
            return Response(
                {"detail": "course_id and message are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            course = Course.objects.get(id=course_id)

            subject = CourseSubject(course)

            for student_data in course.students.all():
                subject.attach_student(student_data.student)

            if course.teacher:
                subject.attach_teacher(course.teacher)

            subject.notify(message, title=title, sender=sender)

            return Response(
                {"detail": "Notifications sent."},
                status=status.HTTP_201_CREATED
            )

        except Course.DoesNotExist:
            return Response(
                {"detail": "Course not found."},
                status=status.HTTP_404_NOT_FOUND
            )

    
class MarkAllReadView(APIView):
    def post(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"detail": "All notifications marked as read."}, status=status.HTTP_200_OK)
class SentNotificationListView(APIView):
    def get(self, request):
        notifications = Notification.objects.filter(sender=request.user)
        data = []

        for n in notifications:
            recipients = Notification.objects.filter(
                title=n.title, created_at=n.created_at, sender=n.sender
            ).exclude(user=n.sender)
            
            data.append({
                "id": n.id,
                "title": n.title,
                "message": n.message,
                "course_title": n.course.title if n.course else None,
                "created_at": n.created_at,
                "recipient_count": recipients.count(),
                "recipient_ids": list(recipients.values_list('id', flat=True))
            })

        return Response(data)
