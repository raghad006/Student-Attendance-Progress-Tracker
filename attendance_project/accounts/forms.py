from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import User

class CustomUserCreationForm(UserCreationForm):
    role = forms.ChoiceField(choices=User.ROLE_CHOICES, label="Role")

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("email", "first_name", "last_name", "role", "password1", "password2")

    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = self.cleaned_data.get("role", "STU")

        if not user.username:
            user.username = User.objects.generate_unique_username(user.first_name, user.role)

        if commit:
            user.save()
        return user

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = "__all__"
