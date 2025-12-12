from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Notification

class NotificationService:

    @staticmethod
    def notify_user(user, message):
        Notification.objects.create(user=user, message=message)

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{user.id}",
            {
                "type": "send_notification",
                "message": message
            }
        )

class NotificationSubject:

    def __init__(self):
        self._observers = []

    def attach(self, user):
        if user not in self._observers:
            self._observers.append(user)

    def detach(self, user):
        if user in self._observers:
            self._observers.remove(user)

    def notify(self, message):
        for user in self._observers:
            NotificationService.notify_user(user, message)
