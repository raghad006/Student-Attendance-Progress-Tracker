from .observer import Observer
from .services import NotificationService

class UserObserver(Observer):
    def __init__(self, user, sender=None):
        self.user = user
        self.sender = sender

    def update(self, message: str, **kwargs):
        title = kwargs.get('title', 'Notification')
        course = kwargs.get('course', None)
        sender = kwargs.get('sender', self.sender)

        NotificationService.notify_user(
            self.user,
            message,
            sender=sender,
            course=course,
            title=title
        )