from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import AttendanceRecord
from notifications.CourseSubject import CourseSubject

@receiver(post_save, sender=AttendanceRecord)
def notify_attendance_updated(sender, instance, created, **kwargs):
    if created:
        subject = CourseSubject(instance.course)
        subject.attach_student(instance.student.student)
        subject.notify(f"Attendance for '{instance.course.title}' on {instance.date} is updated: {instance.get_status_display()}")
