import random
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.db import IntegrityError
from time import sleep

class CustomUserManager(BaseUserManager):
    def generate_unique_username(self, first_name, role):
        base = first_name.lower()
        base = "".join(ch for ch in base if ch.isalnum())
        if not base:
            base = "user"

        for _ in range(100):
            number = random.randint(10000, 99999)
            username_candidate = f"{base}_{role}{number}"
            if not self.model.objects.filter(username=username_candidate).exists():
                return username_candidate
            sleep(0.01)
        raise IntegrityError("Could not generate a unique username after 100 attempts.")

    def create_user(self, email, password=None, first_name="", last_name="", role="STU", **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, role=role, **extra_fields)
        user.username = self.generate_unique_username(first_name, role)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, first_name="Admin", last_name="", **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        return self.create_user(email=email, password=password, first_name=first_name, last_name=last_name, role="TCR", **extra_fields)

class User(AbstractUser):
    STUDENT = "STU"
    TEACHER = "TCR"
    ROLE_CHOICES = [(STUDENT, "Student"), (TEACHER, "Teacher")]

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=3, choices=ROLE_CHOICES)
    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "role"]

    objects = CustomUserManager()

    def __str__(self):
        return self.username
