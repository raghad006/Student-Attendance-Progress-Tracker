from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from .models import Course, StudentData
from notifications.CourseSubject import CourseSubject

@receiver(post_save, sender=Course)
def notify_teacher_on_course(sender, instance, created, **kwargs):
    if created and instance.teacher:
        subject = CourseSubject(instance)
        subject.attach_teacher(instance.teacher)
        subject.notify(f"Welcome to the course '{instance.title}'")
@receiver(m2m_changed, sender=StudentData.courses.through)
def notify_student_on_assignment(sender, instance, action, pk_set, **kwargs):
    if action == "post_add":
        for course_id in pk_set:
            course = Course.objects.get(id=course_id)
            subject = CourseSubject(course)
            subject.attach_student(instance.student)
            subject.attach_teacher(course.teacher)
            subject.notify(f"Student '{instance.student.username}' enrolled in '{course.title}'")
