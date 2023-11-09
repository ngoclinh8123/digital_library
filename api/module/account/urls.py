import os
from django.urls import path, include

app_name = os.getcwd().split(os.sep)[-1]

urlpatterns = (
    path("user/", include("module.account.user.urls", namespace="user")),
    path("role/", include("module.account.role.urls", namespace="role")),
)
