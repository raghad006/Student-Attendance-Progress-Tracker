from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    course_title = serializers.SerializerMethodField()  
    course_id = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            "id",
            "title",           
            "message",         
            "sender",
            "course",          
            "course_id",       
            "course_title",   
            "is_read",
            "created_at",
        ]
    
    def get_sender(self, obj):
        if obj.sender:
            return obj.sender.get_full_name() or obj.sender.username
        return "System"
    
    def get_course_id(self, obj):
        return obj.course.id if obj.course else None
    
    def get_course_title(self, obj):
        return obj.course.title if obj.course else None