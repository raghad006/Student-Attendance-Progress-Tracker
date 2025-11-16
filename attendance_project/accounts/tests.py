from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from .serializers import CustomTokenObtainPairSerializer, ChangePasswordSerializer

User = get_user_model()


class AuthTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            email="student@example.com",
            password="TestPass123!",
            first_name="Test",
            last_name="Student",
            role="STU"
        )

        self.login_url = reverse("token_obtain_pair") 
        self.change_password_url = reverse("change-password")  

    def test_serializer_login_with_email(self):
        data = {"identifier": "student@example.com", "password": "TestPass123!"}
        serializer = CustomTokenObtainPairSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_serializer_login_with_username(self):
        data = {"identifier": self.user.username, "password": "TestPass123!"}
        serializer = CustomTokenObtainPairSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_serializer_wrong_password(self):
        data = {"identifier": self.user.email, "password": "WrongPass"}
        serializer = CustomTokenObtainPairSerializer(data=data)
        self.assertFalse(serializer.is_valid())

    def test_api_login_with_email(self):
        response = self.client.post(
            self.login_url,
            {"identifier": "student@example.com", "password": "TestPass123!"},
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.json())
        self.assertIn("refresh", response.json())

    def test_api_login_with_username(self):
        response = self.client.post(
            self.login_url,
            {"identifier": self.user.username, "password": "TestPass123!"},
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.json())
        self.assertIn("refresh", response.json())

    def test_change_password_success(self):
        login_response = self.client.post(
            self.login_url,
            {"identifier": self.user.email, "password": "TestPass123!"},
            content_type="application/json"
        )
        token = login_response.json()["access"]

        self.client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {token}"

        response = self.client.post(
            self.change_password_url,
            {"old_password": "TestPass123!", "new_password": "NewPass123!"},
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["detail"], "Password changed successfully.")

    def test_change_password_wrong_old(self):
        login_response = self.client.post(
            self.login_url,
            {"identifier": self.user.email, "password": "TestPass123!"},
            content_type="application/json"
        )
        token = login_response.json()["access"]

        self.client.defaults["HTTP_AUTHORIZATION"] = f"Bearer {token}"

        response = self.client.post(
            self.change_password_url,
            {"old_password": "WrongOld", "new_password": "NewPass123!"},
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["detail"], "Old password is incorrect.")
