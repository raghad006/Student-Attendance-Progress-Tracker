from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from students.models import StudentData, Course
from .models import AttendanceRecord
from .serializers import AttendanceRecordSerializer
from datetime import date

class TakeAttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role != "TCR":
            return AttendanceRecord.objects.none()
        return AttendanceRecord.objects.filter(course__teacher=user)

    def create(self, request, *args, **kwargs):
        """
        Expected payload:
        {
            "course_id": 1,
            "records": [
                {"student_id": 1, "status": "P"},
                {"student_id": 2, "status": "A"}
            ]
        }
        """
        user = request.user
        if user.role != "TCR":
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        course_id = request.data.get("course_id")
        records = request.data.get("records", [])

        try:
            course = Course.objects.get(id=course_id, teacher=user)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        created_records = []
        for record in records:
            student_id = record.get("student_id")
            status_value = record.get("status", "P")
            try:
                student = StudentData.objects.get(id=student_id, courses=course)
            except StudentData.DoesNotExist:
                continue

            attendance, created = AttendanceRecord.objects.update_or_create(
                student=student,
                course=course,
                date=date.today(),
                defaults={"status": status_value}
            )
            created_records.append(attendance)

        serializer = AttendanceRecordSerializer(created_records, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
