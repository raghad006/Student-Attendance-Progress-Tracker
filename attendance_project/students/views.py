from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import StudentData, Course
from .serializers import CourseSerializer, StudentDataSerializer, StudentSerializer

class StudentDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            student_data = StudentData.objects.get(student=request.user)
        except StudentData.DoesNotExist:
            return Response({"courses": []})
        
        courses = student_data.courses.all()
        serializer = CourseSerializer(courses, many=True)
        return Response({"courses": serializer.data})

class TeacherDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != "TCR":
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
        
        courses = Course.objects.filter(teacher=user)
        serializer = CourseSerializer(courses, many=True)
        return Response({"courses": serializer.data})

class CourseListCreateView(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "TCR":
            return Course.objects.filter(teacher=user)
        return Course.objects.all()

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "TCR":
            return Course.objects.filter(teacher=user)
        return Course.objects.all()

class EnrollStudentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        student = request.user
        course_id = request.data.get("course_id")
        try:
            student_data, _ = StudentData.objects.get_or_create(student=student)
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if student_data.courses.filter(id=course.id).exists():
            return Response({"detail": "Already enrolled"}, status=status.HTTP_400_BAD_REQUEST)
        
        if student_data.courses.count() >= course.max_students:
            return Response({"detail": "Course is full"}, status=status.HTTP_400_BAD_REQUEST)
        
        student_data.courses.add(course)
        return Response({"detail": "Enrolled successfully"}, status=status.HTTP_201_CREATED)

class CourseStudentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            course = Course.objects.get(id=pk)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        
        student_data_qs = StudentData.objects.filter(courses=course)
        serializer = StudentSerializer(student_data_qs, many=True)
        return Response(serializer.data)
