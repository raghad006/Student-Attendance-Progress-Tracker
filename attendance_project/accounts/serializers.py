from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    full_name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["full_name", "email", "role", "password", "password2"]
        extra_kwargs = {
            "password": {"write_only": True, "validators": [validate_password]},
        }

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("password2"):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        full_name = validated_data.pop("full_name")
        password = validated_data.pop("password")

        user = User.objects.create_user(
            email=validated_data.get("email"),
            role=validated_data.get("role"),
            full_name=full_name,
            password=password
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        username_field = self.username_field
        email = attrs.get(username_field)

        UserModel = get_user_model()
        if not UserModel.objects.filter(**{username_field: email}).exists():
            raise serializers.ValidationError({
                "non_field_errors": ["No account found. Please sign up."]
            })

        data = super().validate(attrs)
        data["user"] = {
            "email": self.user.email,
            "username": self.user.username,
            "role": self.user.role,
            "user_id": self.user.user_id,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
        }
        return data
