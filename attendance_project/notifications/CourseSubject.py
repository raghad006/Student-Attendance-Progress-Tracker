from .subject import Subject
from .observers import UserObserver
from students.models import Course

class CourseSubject(Subject):
    def __init__(self, course: Course):
        super().__init__()
        self.course = course

    def attach_student(self, student_user):
        self.attach(UserObserver(student_user))

    def attach_teacher(self, teacher_user):
        if teacher_user:
            self.attach(UserObserver(teacher_user))
