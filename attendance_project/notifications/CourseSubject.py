from .subject import Subject
from .observers import UserObserver
from students.models import Course

class CourseSubject(Subject):
    def __init__(self, course: Course):
        super().__init__()
        self.course = course

    def attach_student(self, student_user):
        if student_user:
            sender = self.course.teacher
            self.attach(UserObserver(student_user, sender=sender))

    def attach_teacher(self, teacher_user):
        if teacher_user:
            self.attach(UserObserver(teacher_user, sender=teacher_user))
    def notify(self, message, title="Notification", sender=None, **kwargs):
        for observer in self._observers:
            observer.update(
            message=message,
            title=title,
            sender=sender,
            course=self.course,
            **kwargs
        )
