from django.contrib import admin
from django import forms
from .models import StudentData, Course
from accounts.models import User

class StudentDataForm(forms.ModelForm):
    class Meta:
        model = StudentData
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['student'].queryset = User.objects.filter(role='STU')

@admin.register(StudentData)
class StudentDataAdmin(admin.ModelAdmin):
    form = StudentDataForm
    list_display = ('student', 'last_updated', 'course_list')
    filter_horizontal = ('courses',)
    def course_list(self, obj):
        return ", ".join(course.title for course in obj.courses.all())
    course_list.short_description = 'Courses'

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'teacher', 'current_student_count', 'max_students', 'created_at')
    search_fields = ('title',)
    list_filter = ('teacher',)
    autocomplete_fields = ('teacher',)
