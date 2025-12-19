from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import AttendanceRecord
from notifications.services import NotificationService


@receiver(post_save, sender=AttendanceRecord)
def notify_attendance_updated(sender, instance, created, **kwargs):
    if created:
        NotificationService.notify_user(
            user=instance.student.student,
            title="Attendance Update",
            message=(
                f"Your attendance for '{instance.course.title}' on "
                f"{instance.date} is marked as {instance.get_status_display()}."
            ),
            sender=instance.course.teacher, 
            course_title=instance.course.title
        )
