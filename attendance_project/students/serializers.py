from rest_framework import serializers
from accounts.models import User
from .models import StudentData, Course

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email"]

class CourseSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer(read_only=True)
    teacher_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="TCR"),
        write_only=True,
        required=False,
        allow_null=True,
        source="teacher"
    )
    current_student_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "teacher",
            "teacher_id",
            "max_students",
            "current_student_count",
            "created_at"
        ]

class StudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    fullId = serializers.CharField(source="student.username")

    class Meta:
        model = StudentData
        fields = ["id", "name", "fullId"]

    def get_name(self, obj):
        full_name = obj.student.get_full_name()
        return full_name if full_name else obj.student.username

class StudentDataSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    courses = CourseSerializer(many=True, read_only=True)
    course_ids = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        many=True,
        write_only=True,
        source="courses"
    )

    class Meta:
        model = StudentData
        fields = ["student", "courses", "course_ids", "last_updated"]
