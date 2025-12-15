from datetime import date
from django.shortcuts import get_object_or_404

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from students.models import StudentData, Course
from .models import AttendanceRecord
from .serializers import AttendanceRecordSerializer


class TakeAttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role != "TCR":
            return AttendanceRecord.objects.none()
        return AttendanceRecord.objects.filter(course__teacher=user)

    def create(self, request, *args, **kwargs):
        user = request.user
        if user.role != "TCR":
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        course_id = request.data.get("course_id")
        records = request.data.get("records", [])
        course = get_object_or_404(Course, id=course_id, teacher=user)

        created_records = []

        for record in records:
            student_id = record.get("student_id")
            status_value = record.get("status", "P")
            notes_value = record.get("notes", "")
            record_date = record.get("date")
            record_date = date.fromisoformat(record_date) if record_date else date.today()

            try:
                student = StudentData.objects.get(
                    id=student_id,
                    courses=course
                )
            except StudentData.DoesNotExist:
                continue

            attendance, _ = AttendanceRecord.objects.update_or_create(
                student=student,
                course=course,
                date=record_date,
                defaults={
                    "status": status_value,
                    "notes": notes_value
                }
            )

            created_records.append(attendance)

        serializer = AttendanceRecordSerializer(created_records, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AttendanceStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        user = request.user
        if user.role != "TCR":
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        course = get_object_or_404(Course, id=course_id, teacher=user)
        students = course.students.all()
        data = []

        for student in students:
            records = AttendanceRecord.objects.filter(
                course=course,
                student=student
            ).order_by("date")

            total_lectures = records.count()
            total_score = 0.0
            timeline = []

            for record in records:
                if record.status == "P":
                    score = 1.0
                    status_text = "Present"
                elif record.status == "L":
                    score = 0.7
                    status_text = "Late"
                else:
                    score = 0.0
                    status_text = "Absent"

                total_score += score

                timeline.append({
                    "date": record.date,
                    "status": status_text,
                    "notes": record.notes
                })

            attendance_rate = (
                round((total_score / total_lectures) * 100, 2)
                if total_lectures > 0 else 0
            )

            grade_out_of_5 = round((attendance_rate / 100) * 5, 2)

            data.append({
                "id": student.id,
                "name": student.user.get_full_name() if hasattr(student, "user") else "",
                "username": student.user.username if hasattr(student, "user") else "",
                "fullId": student.fullId,
                "total_lectures": total_lectures,
                "attendance_rate": attendance_rate,
                "grade_out_of_5": grade_out_of_5,
                "timeline": timeline
            })

        return Response(data, status=status.HTTP_200_OK)
