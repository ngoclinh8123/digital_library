import os
from django.urls import path, include
from .ping import PingAPIView

app_name = os.getcwd().split(os.sep)[-1]

urlpatterns = (
    path("noti/", include("module.noti.urls", namespace="noti")),
    path("account/", include("module.account.urls", namespace="account")),
    path(
        "configuration/",
        include("module.conf.urls", namespace="configuration"),
    ),
    path("library/", include("module.library.urls", namespace="library")),
    path("ping/", PingAPIView.as_view()),
)
