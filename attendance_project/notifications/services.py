from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Notification
from .serializers import NotificationSerializer

class NotificationService:
    @staticmethod
    def notify_user(user, message, sender=None, course=None, title="Notification"):
        
        notification = Notification.objects.create(
            user=user,
            title=title,  
            message=message,
            sender=sender,
            course=course,
        )
        
        serializer = NotificationSerializer(notification)
        
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{user.id}",
            {
                "type": "send_notification",
                "notification": serializer.data
            }
        )