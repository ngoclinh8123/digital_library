import django_filters

from ..models import Book


class BookFilter(django_filters.FilterSet):
    class Meta:
        model = Book
        fields = {
            "title": ["exact"],
            "id": ["exact"],
        }
