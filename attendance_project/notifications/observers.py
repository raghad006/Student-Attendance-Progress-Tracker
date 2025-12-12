from .observer import Observer
from .services import NotificationService

class UserObserver(Observer):
    def __init__(self, user):
        self.user = user

    def update(self, message: str):
        NotificationService.notify_user(self.user, message)
