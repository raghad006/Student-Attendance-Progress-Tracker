
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import StudentData, Course
from .serializers import CourseSerializer

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

