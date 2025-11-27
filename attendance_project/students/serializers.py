
from rest_framework import serializers
from .models import StudentData, Course

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ("id", "title", "description")

class StudentDataSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True)

    class Meta:
        model = StudentData
        fields = ("student", "courses")