from django.db import models
from accounts.models import User

class Course(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class StudentData(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    courses = models.ManyToManyField(Course)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.username}"