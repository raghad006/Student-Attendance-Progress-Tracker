from django.db import models
from accounts.models import User
from students.models import Course

class Notification(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )
    sender = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, 
        related_name="sent_notifications"
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    course = models.ForeignKey(
        Course, on_delete=models.SET_NULL, null=True, blank=True, 
        related_name="notifications"
    )
    course_title = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if self.course:
            self.course_title = self.course.title
        elif not self.course_title:
            self.course_title = None
        super().save(*args, **kwargs)
    
    @property
    def course_code(self):
        return None
    
    @property
    def course_id(self):
        return self.course.id if self.course else None
    
    class Meta:
        pass