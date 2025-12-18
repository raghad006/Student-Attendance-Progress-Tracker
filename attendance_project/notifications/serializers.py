from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True) 
    title = serializers.CharField(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'is_read', 'created_at', 'course_title', 'course_code', 'sender']
