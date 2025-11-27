from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from accounts.models import User
from students.models import StudentData, Course

class StudentsAppTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='teststudent@example.com',
            password='testpass123',
            first_name='Test',
            last_name='Student'
        )

        self.course1 = Course.objects.create(title='Math 101', description='Basic Math')
        self.course2 = Course.objects.create(title='Physics 101', description='Basic Physics')

        self.student_data = StudentData.objects.create(student=self.user)
        self.student_data.courses.add(self.course1, self.course2)

        self.client = APIClient()
    
        self.client.force_authenticate(user=self.user)

    def test_student_data_creation(self):
        self.assertEqual(self.student_data.student, self.user)
        self.assertEqual(self.student_data.courses.count(), 2)
        self.assertIn(self.course1, self.student_data.courses.all())
        self.assertIn(self.course2, self.student_data.courses.all())

    def test_dashboard_authenticated(self):
        url = reverse('student_dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        course_titles = [c['title'] for c in response.data.get('courses', [])]
        self.assertIn('Math 101', course_titles)
        self.assertIn('Physics 101', course_titles)

    def test_dashboard_unauthenticated(self):
        self.client.force_authenticate(user=None)
        url = reverse('student_dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)

