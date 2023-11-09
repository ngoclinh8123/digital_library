from django.db import models
from service.framework.model.timestamped_model import TimeStampedModel
from module.library.category.models import Category
from module.library.author.models import Author
from module.library.rack.models import Rack
from module.account.user.models import User
from .consts import LANGUAGE_CHOICES, OrderStatus, VN, NOT_AVAILABLE_STATUS
# import consts
import os
import uuid
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator


def file_dest(instance, filename):
    ext = filename.split(".")[-1]
    return os.path.join("books/files", f"{uuid.uuid4()}.{ext}")


def file_max_size_validator(file):
    MAX_FILE_SIZE_MB = 2
    if file.size > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise ValidationError(f"Max file size is {MAX_FILE_SIZE_MB}MB")


class Book(TimeStampedModel):
    title = models.CharField(max_length=255)
    language = models.CharField(max_length=60, choices=LANGUAGE_CHOICES, default=VN)
    publisher = models.CharField(max_length=250, null=True, blank=True)
    quantity = models.IntegerField()
    publication_date = models.DateTimeField()
    price = models.IntegerField()
    thumbnail = models.ImageField(upload_to="books", null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    file = models.FileField(upload_to=file_dest, null=True, blank=True,
                            validators=[file_max_size_validator, FileExtensionValidator(['pdf', 'docx', 'doc'])])
    categories = models.ManyToManyField(Category, related_name='books')
    authors = models.ManyToManyField(Author, related_name='books')

    def __str__(self):
        return self.title

    @property
    def is_available(self):
        return self.total_book_items > self.total_ordered_book_items

    @property
    def total_available_book_items(self):
        return self.total_book_items - self.total_ordered_book_items

    @property
    def total_book_items(self):
        return self.bookitem_set.count()

    @property
    def total_ordered_book_items(self):
        return self.bookitem_set.filter(order__status__in=NOT_AVAILABLE_STATUS).count()

    class Meta:
        db_table = "books"
        ordering = ["-id"]


class BookItem(TimeStampedModel):
    barcode = models.CharField(max_length=255, unique=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    users = models.ManyToManyField(User, related_name='book_items', through='Order')
    rack = models.ForeignKey(Rack, null=True, blank=True, default=None, on_delete=models.CASCADE)

    def __str__(self):
        return self.barcode

    class Meta:
        db_table = "book_items"
        ordering = ["-id"]


class Order(TimeStampedModel):
    book_item = models.ForeignKey(BookItem, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=250, choices=OrderStatus.choices, default=OrderStatus.REQUESTED)
    request_at = models.DateTimeField(auto_now_add=True)
    approve_at = models.DateTimeField(null=True, blank=True)
    borrow_at = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    return_at = models.DateTimeField(null=True, blank=True)
    cancel_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.id

    class Meta:
        db_table = "orders"
        ordering = ["-id"]
