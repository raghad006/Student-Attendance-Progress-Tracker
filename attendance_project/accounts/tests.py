
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User

class AuthTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="existing@test.com",
            password="Testpass123!",
            role=User.STUDENT,
            full_name="Existing User"
        )

    def test_register_user_success(self):
        url = reverse('register')
        data = {
            "full_name": "New User",
            "email": "newuser@test.com",
            "role": User.STUDENT,
            "password": "Newpass123!",
            "password2": "Newpass123!"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="newuser@test.com").exists())
        new_user = User.objects.get(email="newuser@test.com")
        self.assertTrue(len(new_user.user_id) == 9)
        self.assertTrue(new_user.username.split('.')[-1].isdigit())

    def test_register_user_password_mismatch(self):
        url = reverse('register')
        data = {
            "full_name": "Fail User",
            "email": "failuser@test.com",
            "role": User.STUDENT,
            "password": "Password123",
            "password2": "Password456",
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_register_invalid_role(self):
        url = reverse('register')
        data = {
            "full_name": "Role User",
            "email": "roleuser@test.com",
            "role": "INVALID",
            "password": "Rolepass123!",
            "password2": "Rolepass123!"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("role", response.data)

    def test_login_success(self):
        url = reverse('token_obtain_pair')
        data = {
            "email": "existing@test.com",
            "password": "Testpass123!"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["email"], "existing@test.com")
