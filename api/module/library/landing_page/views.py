import math
from django.conf import settings
from django.views.generic import TemplateView
from django.db.models import Count, Exists, OuterRef, Q, Case, When, IntegerField
from module.library.book.models import Book
from module.library.category.models import Category


class BaseView(TemplateView):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context["category_ebooks"] = Category.objects.annotate(
            book_count=Count("books")
        ).filter(book_count__gt=0)

        category_books = Category.objects.annotate(
            book_count=Count("books", filter=Q(books__bookitem__isnull=False))
        ).filter(book_count__gt=0)

        for category in category_books:
            book_count_distinct = (
                category.books.filter(bookitem__isnull=False).distinct().count()
            )
            category.book_item_count = book_count_distinct

        context["category_books"] = category_books

        context["domain"] = f"{settings.PROTOCOL}://{settings.DOMAIN}/public/media/"

        return context

    def get_desired_book(self, amount, categories):
        desired_book_count = amount
        books_to_fetch = desired_book_count
        books_fetched = []

        for category in categories:
            books_in_category = category.books.all()[:books_to_fetch]
            books_fetched.extend(books_in_category)

            if len(books_fetched) >= desired_book_count:
                break

            books_to_fetch = desired_book_count - len(books_fetched)

        return books_fetched


class HomeView(BaseView):
    template_name = "home.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context["books"] = self.get_desired_book(6, context["category_books"])
        context["ebooks"] = self.get_desired_book(6, context["category_ebooks"])

        return context


class BookView(BaseView):
    template_name = "book.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for category in context["category_books"]:
            book_has_bookitems = category.books.filter(
                bookitem__isnull=False
            ).distinct()
            category.book_has_bookitems = book_has_bookitems
        return context


class EBookView(BaseView):
    template_name = "ebook.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


class BookCategoryView(BaseView):
    template_name = "book_category.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        id = self.kwargs["id"]
        title = ""
        books = []
        for category in context["category_books"]:
            if category.id == int(id):
                title = category.title
                books = category.books.annotate(
                    book_item_count=Count("bookitem")
                ).filter(book_item_count__gt=0)
                break

        context["id"] = int(id)
        context["title"] = title

        page_size = 12
        total_book = len(books)
        total_page = math.ceil(total_book / page_size)
        current_page = int(self.request.GET.get("page", 1))

        end_book = page_size * current_page
        start_book = end_book - page_size

        context["books"] = books[start_book:end_book]
        context["current_page"] = current_page
        context["total_page"] = range(1, total_page + 1)
        context["total_number_page"] = total_page
        return context


class EBookCategoryView(BaseView):
    template_name = "ebook_category.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        id = self.kwargs["id"]
        title = ""
        books = []
        for category in context["category_ebooks"]:
            if category.id == int(id):
                title = category.title
                books = category.books.all()
                break

        context["id"] = int(id)
        context["title"] = title

        page_size = 12
        total_book = len(books)
        total_page = math.ceil(total_book / page_size)
        current_page = int(self.request.GET.get("page", 1))

        end_book = page_size * current_page
        start_book = end_book - page_size

        context["books"] = books[start_book:end_book]
        context["current_page"] = current_page
        context["total_page"] = range(1, total_page + 1)
        context["total_number_page"] = total_page
        return context


class BookDetailView(BaseView):
    template_name = "book_detail.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        id = self.kwargs["id"]
        book = Book.objects.filter(id=id).first()
        if book:
            context["type"] = "book"

            book.language = (
                "Tiếng Việt" if book.language == "VIETNAMESE" else "Tiếng Anh"
            )
            context["book"] = book
            context["total_book_items"] = book.total_book_items
            context["total_available_book_items"] = book.total_available_book_items

            context["relate_books"] = self.get_desired_book(
                6, context["category_books"]
            )

        return context


class EBookDetailView(BaseView):
    template_name = "book_detail.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        id = self.kwargs["id"]
        book = Book.objects.filter(id=id).first()
        if book:
            context["type"] = "ebook"

            book.language = (
                "Tiếng Việt" if book.language == "VIETNAMESE" else "Tiếng Anh"
            )
            context["book"] = book
            context["total_book_items"] = book.total_book_items
            context["total_available_book_items"] = book.total_available_book_items

            context["relate_books"] = self.get_desired_book(
                6, context["category_ebooks"]
            )

        return context
