import os
from rest_framework import routers
from django.urls import path
from .views.auth import (
    LoginView,
    RefreshTokenView,
    RefreshCheckView,
    LogoutView,
    ResetPasswordView,
    ChangePasswordView,
    SignupView,
)
from .views.crud import UserViewSet
from .views.profile import ProfileView


app_name = os.getcwd().split(os.sep)[-1]
router = routers.SimpleRouter()
router.register(r'', UserViewSet)

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("signup/", SignupView.as_view(), name="login"),
    path("refresh-token/", RefreshTokenView.as_view(), name="refresh_token"),
    path("refresh-check/", RefreshCheckView.as_view(), name="refresh_check"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset_password"),
    path("change-password/", ChangePasswordView.as_view(), name="change_password"),
    path("profile/", ProfileView.as_view(), name="profile"),
]

urlpatterns += router.urls
