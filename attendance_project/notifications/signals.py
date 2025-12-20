from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from .models import Course, StudentData
from notifications.services import NotificationService

@receiver(post_save, sender=Course)
def notify_teacher_on_course(sender, instance, created, **kwargs):
    if created and instance.teacher:
        NotificationService.notify_teacher(
            instance,
            f"Welcome to the Course :'{instance.title}'."
        )
    if not created:
        old_teacher = Course.objects.get(id=instance.id).teacher
        new_teacher = instance.teacher
        if old_teacher != new_teacher and new_teacher is not None:
            NotificationService.notify_teacher(
                instance,
                f"Welcome to the Course :'{instance.title}'."
            )

@receiver(m2m_changed, sender=StudentData.courses.through)
def notify_student_on_assignment(sender, instance, action, pk_set, **kwargs):
    if action == "post_add":
        for course_id in pk_set:
            course = Course.objects.get(id=course_id)
            NotificationService.notify_user(
                instance.student,
                f"Welcome to the Course :'{course.title}'."
            )

            if course.teacher:
                NotificationService.notify_user(
                    course.teacher,
                    f"New student assigned to '{course.title}': {instance.student.username}"
                )
