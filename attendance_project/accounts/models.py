from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):

    def create_user(self, email, password=None, role=None, full_name=None, **extra_fields):
        if not email:
            raise ValueError("Email must be set")
        if not role:
            raise ValueError("Role must be set (STU or TCR)")

        from .utils import generate_unique_user_id_and_username
        email = self.normalize_email(email)
        user_id, username = generate_unique_user_id_and_username(full_name or "", role)

        extra_fields.pop("user_id", None)
        extra_fields.pop("username", None)

        user = self.model(
            email=email,
            username=username,
            role=role,
            user_id=user_id,
            **extra_fields
    )
        user.set_password(password)
        user.save(using=self._db)
        return user


    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        local = email.split("@")[0] if email else "admin"
        return self.create_user(email=email, password=password, role=self.model.TCR, full_name=local, **extra_fields)


class User(AbstractUser):
    STUDENT = "STU"
    TEACHER = "TCR"
    ROLE_CHOICES = [
        (STUDENT, "Student"),
        (TEACHER, "Teacher"),
    ]

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=3, choices=ROLE_CHOICES)
    user_id = models.CharField(max_length=9, unique=True, editable=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.username} ({self.user_id})"
