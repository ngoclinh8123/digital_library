import os
from django.urls import path
from .views import (
    HomeView,
    BookView,
    EBookView,
    BookCategoryView,
    EBookCategoryView,
    BookDetailView,
    EBookDetailView,
)

app_name = os.getcwd().split(os.sep)[-1]

urlpatterns = [
    path("", HomeView.as_view(), name="home_page"),
    path("book/", BookView.as_view(), name="book_page"),
    path("ebook/", EBookView.as_view(), name="ebook_page"),
    path(
        "book/category/<slug:id>", BookCategoryView.as_view(), name="book_category_page"
    ),
    path(
        "ebook/category/<slug:id>",
        EBookCategoryView.as_view(),
        name="ebook_category_page",
    ),
    path(
        "book/<slug:id>",
        BookDetailView.as_view(),
        name="book_detail_page",
    ),
    path(
        "ebook/<slug:id>",
        EBookDetailView.as_view(),
        name="ebook_detail_page",
    ),
]
