from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from unittest.mock import patch
from accounts.models import User
from students.models import Course, StudentData


@patch('notifications.services.NotificationService.notify_user')
class StudentsAndTeachersTests(TestCase):
    def setUp(self):
        self.teacher = User.objects.create_user(
            email='teacher@example.com',
            password='teachpass123',
            first_name='Teach',
            last_name='Er',
            role='TCR'
        )

        self.student = User.objects.create_user(
            email='student@example.com',
            password='studpass123',
            first_name='Stu',
            last_name='Dent',
            role='STU'
        )

        self.course1 = Course.objects.create(
            title='Biology 101',
            description='Basic Biology',
            teacher=self.teacher
        )
        self.course2 = Course.objects.create(
            title='Chemistry 101',
            description='Basic Chemistry',
            teacher=self.teacher
        )

        self.student_data = StudentData.objects.create(student=self.student)
        self.student_data.courses.add(self.course1)

        self.client = APIClient()

    def test_student_dashboard_authenticated(self, mock_notify):
        self.client.force_authenticate(user=self.student)
        url = reverse('student_dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        course_titles = [c['title'] for c in response.data.get('courses', [])]
        self.assertIn('Biology 101', course_titles)
        self.assertNotIn('Chemistry 101', course_titles)

    def test_student_dashboard_no_courses(self, mock_notify):
        new_student = User.objects.create_user(
            email='newstudent@example.com',
            password='newpass',
            role='STU'
        )
        self.client.force_authenticate(user=new_student)
        url = reverse('student_dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['courses'], [])

    def test_teacher_dashboard_authenticated(self, mock_notify):
        self.client.force_authenticate(user=self.teacher)
        url = reverse('teacher_dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        course_titles = [c['title'] for c in response.data.get('courses', [])]
        self.assertIn('Biology 101', course_titles)
        self.assertIn('Chemistry 101', course_titles)

    def test_teacher_dashboard_not_teacher(self, mock_notify):
        self.client.force_authenticate(user=self.student)
        url = reverse('teacher_dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['detail'], 'Not authorized')

    def test_course_students_view(self, mock_notify):
        self.client.force_authenticate(user=self.teacher)
        url = reverse('course_students', kwargs={'pk': self.course1.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        student_names = [s['name'] for s in response.data]
        self.assertIn('Stu Dent', student_names)

    def test_course_students_view_not_found(self, mock_notify):
        self.client.force_authenticate(user=self.teacher)
        url = reverse('course_students', kwargs={'pk': 999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['detail'], 'Course not found')

    def test_enroll_student_success(self, mock_notify):
        new_course = Course.objects.create(title='Physics 101', teacher=self.teacher)
        self.client.force_authenticate(user=self.student)
        url = reverse('enroll_student')
        response = self.client.post(url, {'course_id': new_course.id})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['detail'], 'Enrolled successfully')

    def test_enroll_student_already_enrolled(self, mock_notify):
        self.client.force_authenticate(user=self.student)
        url = reverse('enroll_student')
        response = self.client.post(url, {'course_id': self.course1.id})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['detail'], 'Already enrolled')

    def test_enroll_student_course_full(self, mock_notify):
        full_course = Course.objects.create(title='Full Course', teacher=self.teacher, max_students=0)
        self.client.force_authenticate(user=self.student)
        url = reverse('enroll_student')
        response = self.client.post(url, {'course_id': full_course.id})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['detail'], 'Course is full')
