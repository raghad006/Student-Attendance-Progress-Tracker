from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from .models import Course, StudentData
from notifications.services import NotificationService

@receiver(post_save, sender=Course)
def notify_teacher_on_course(sender, instance, created, **kwargs):
    print(f"[DEBUG] post_save signal fired for Course id={instance.id}, created={created}")
    if created and instance.teacher:
        NotificationService.notify_user(
            user=instance.teacher,
            title="Course Assignment",
            message=f"Welcome {instance.teacher.username}, you are now assigned to teach '{instance.title}'.",
            sender=None
        )

@receiver(m2m_changed, sender=StudentData.courses.through)
def notify_student_on_assignment(sender, instance, action, pk_set, **kwargs):
    print(f"[DEBUG] m2m_changed signal fired for StudentData id={instance.id}, action={action}, pk_set={pk_set}")
    if action == "post_add":
        for course_id in pk_set:
            course = Course.objects.get(id=course_id)
            NotificationService.notify_user(
                user=instance.student,
                title="Course Enrollment",
                message=f"Welcome to '{course.title}'. Teacher: {course.teacher.username if course.teacher else 'N/A'}.",
                sender=course.teacher
            )
