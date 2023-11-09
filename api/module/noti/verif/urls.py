import os
from django.urls import path


from .views.custom import CheckView, ResendView

app_name = os.getcwd().split(os.sep)[-1]


urlpatterns = [
    path("check/", CheckView.as_view(), name="verifCheck"),
    path("resend/", ResendView.as_view(), name="resendOTP"),
]
