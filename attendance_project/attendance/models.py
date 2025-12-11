from django.db import models
from students.models import StudentData, Course

class AttendanceRecord(models.Model):
    student = models.ForeignKey(StudentData, on_delete=models.CASCADE, related_name="attendance_records")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="attendance_records")
    
    date = models.DateField()  # Remove auto_now_add, we want to set specific dates
    time = models.TimeField(auto_now_add=True)

    STATUS_CHOICES = [
        ('P', 'Present'),
        ('A', 'Absent'),
        ('L', 'Late'),
    ]
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='P')
    notes = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ("student", "course", "date")

    def __str__(self):
        return f"{self.student} - {self.course} - {self.date} - {self.status}"
