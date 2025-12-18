from django.db import models
from accounts.models import User

class Course(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    teacher = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': 'TCR'},
        related_name="teaching_courses"
    )
    max_students = models.PositiveIntegerField(default=30)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    @property
    def current_student_count(self):
        return self.students.count()


class StudentData(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={"role": "STU"}
    )
    courses = models.ManyToManyField(Course, related_name="students")
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.username}"

    @property
    def full_name(self):
        return f"{self.student.first_name} {self.student.last_name}" if self.student.first_name else self.student.username

    @property
    def fullId(self):
        return f"STU{self.student.id:04d}"
