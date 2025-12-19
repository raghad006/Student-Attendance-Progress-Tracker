from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from .models import Course, StudentData
from notifications.services import NotificationService


@receiver(post_save, sender=Course)
def notify_teacher_on_course(sender, instance, created, **kwargs):
    if created and instance.teacher:
        NotificationService.notify_user(
            user=instance.teacher,
            title="Course Assignment",
            message=f"Welcome {instance.teacher.username}, you are now assigned to teach {instance.title}.",
            sender=None,
            course_title=instance.title
        )


@receiver(m2m_changed, sender=StudentData.courses.through)
def notify_student_on_assignment(sender, instance, action, pk_set, **kwargs):
    if action == "post_add":
        for course_id in pk_set:
            course = Course.objects.get(id=course_id)

            NotificationService.notify_user(
                user=instance.student,
                title="Course Enrollment",
                message=f"Welcome to {course.title}.",
                sender=course.teacher,  
                course_title=course.title
            )
