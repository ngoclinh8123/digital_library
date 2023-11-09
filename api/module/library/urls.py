import os
from django.urls import path, include

app_name = os.getcwd().split(os.sep)[-1]

urlpatterns = (
    path(
        "",
        include("module.library.book.urls", namespace="book"),
    ),
    path(
        "category/",
        include("module.library.category.urls", namespace="category"),
    ),
    path(
        "author/",
        include("module.library.author.urls", namespace="author"),
    ),
    path(
        "rack/",
        include("module.library.rack.urls", namespace="rack"),
    ),
    # path(
    #     "landing-page/",
    #     include("module.library.landing_page.urls", namespace="landing_page"),
    # ),
)
