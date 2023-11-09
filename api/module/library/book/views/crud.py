import random

from rest_framework.viewsets import ModelViewSet
from ..helper.filter import BookFilter
from ..models import Book
from ..helper.sr import BookSr, BookHomeSr
from ...category.helper.sr import CategorySr
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


class BookViewSet(ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSr
    filterset_class = BookFilter
    search_fields = ('title', 'authors__name', )
    ordering_fields = '__all__'

    @action(detail=False, methods=["get"], url_path=r'home', )
    def get_books_for_mobile_home(self, request):
        books = Book.objects.all()
        books = BookHomeSr(books, many=True, context={'request': request}).data

        data = [
            {
                "title": "Slide",
                "books": [book for book in random.choices(books, k=10)]
            },
            {
                "title": "Top 15 đọc nhiều",
                "books": [book for book in random.choices(books, k=10)]
            },
            {
                "title": "Mới cập nhật",
                "books": [book for book in books[:10]]
            },
        ]
        return Response(data, status=status.HTTP_200_OK)

