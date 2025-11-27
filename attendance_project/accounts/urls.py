from django.urls import path
from .views import CustomTokenObtainPairView, test_view, ChangePasswordView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    
    path("test/", test_view, name="test"),
]
