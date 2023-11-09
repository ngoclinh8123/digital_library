import datetime

from rest_framework.serializers import ModelSerializer, CharField

from module.account.user.helper.sr import UserSr
from ..models import Book, BookItem, Order
from ...author.helper.sr import AuthorSr
from ...category.helper.sr import CategorySr
from ...rack.helper.sr import RackSr
from .. import consts
from rest_framework import serializers


class BookSr(ModelSerializer):
    def to_representation(self, instance):
        res = super().to_representation(instance)

        res["categories"] = CategorySr(instance.categories, many=True).data

        res["authors"] = AuthorSr(instance.authors, many=True).data

        return res

    class Meta:
        model = Book
        fields = (
            "id",
            "title",
            "language",
            "publisher",
            "publication_date",
            "thumbnail",
            "quantity",
            "file",
            "description",
            "price",
            "total_available_book_items",
            "total_book_items",
            "is_available",
            "categories",
            "authors",
        )
        read_only_fields = ("id",)


class BookItemSr(ModelSerializer):
    class Meta:
        model = BookItem
        exclude = ()
        read_only_fields = ("id",)


class BookItemOrderSr(ModelSerializer):
    def to_representation(self, instance):
        res = super().to_representation(instance)

        res["book"] = BookSr(
            instance.book,
        ).data

        res["rack"] = RackSr(
            instance.rack,
        ).data

        return res

    class Meta:
        model = BookItem
        exclude = ()
        read_only_fields = ("id",)


class BookHomeSr(ModelSerializer):
    def get_thumbnail_url(self, obj):
        request = self.context.get("request")
        if obj.thumbnail:
            return request.build_absolute_uri(obj.thumbnail.url)
        return None

    def to_representation(self, instance):
        res = super().to_representation(instance)

        res["thumbnail"] = self.get_thumbnail_url(instance)

        res["category"] = (
            instance.categories.first().title if instance.categories.first() else None
        )

        res["author"] = (
            instance.authors.first().name if instance.authors.first() else None
        )

        return res

    class Meta:
        model = Book
        fields = (
            "id",
            "title",
            "thumbnail",
        )
        read_only_fields = ("id",)


class OrderSr(ModelSerializer):
    def to_internal_value(self, data):
        is_update = getattr(self.instance, "pk", None) is not None

        if not is_update:
            try:
                book = Book.objects.get(id=data.get("book"))
            except Book.DoesNotExist:
                raise serializers.ValidationError(
                    {"book": "Invalid book_id. The book does not exist."}
                )

            book_items = BookItem.objects.filter(book_id=book.id)

            if not book_items:
                raise serializers.ValidationError({"detail": "book not available"})

            borrowing_book_item_ids = book_items.filter(
                order__status__in=consts.NOT_AVAILABLE_STATUS
            ).values_list("id", flat=True)

            book_item = book_items.exclude(id__in=borrowing_book_item_ids).first()

            if not book_item:
                raise serializers.ValidationError({"detail": "book not available"})

            data["book_item"] = book_item.id
        if data.get("status") == consts.OrderStatus.APPROVED:
            data["approve_at"] = datetime.datetime.now()

        due_date = datetime.datetime.now() + datetime.timedelta(
            days=consts.INTERVAL_DUE_DATE
        )

        if data.get("status") == consts.OrderStatus.BORROWED:
            data["borrow_at"] = datetime.datetime.now()
            data["due_date"] = due_date

        if data.get("status") == consts.OrderStatus.RETURNED:
            data["return_at"] = datetime.datetime.now()

        if data.get("status") == consts.OrderStatus.CANCELED:
            data["cancel_at"] = datetime.datetime.now()

        return super().to_internal_value(data)

    def to_representation(self, instance):
        res = super().to_representation(instance)
        res["request_at"] = instance.request_at.strftime("%d-%m-%Y")
        res["borrow_at"] = (
            instance.borrow_at.strftime("%d-%m-%Y") if instance.borrow_at else None
        )
        res["approve_at"] = (
            instance.approve_at.strftime("%d-%m-%Y") if instance.approve_at else None
        )
        res["due_date"] = (
            instance.due_date.strftime("%d-%m-%Y") if instance.due_date else None
        )
        res["return_at"] = (
            instance.return_at.strftime("%d-%m-%Y") if instance.return_at else None
        )
        res["cancel_at"] = (
            instance.cancel_at.strftime("%d-%m-%Y") if instance.cancel_at else None
        )

        res["book_item"] = BookItemOrderSr(
            instance.book_item,
        ).data

        res["user"] = UserSr(
            instance.user,
        ).data

        return res

    class Meta:
        model = Order
        fields = (
            "id",
            "status",
            "request_at",
            "approve_at",
            "borrow_at",
            "return_at",
            "due_date",
            "cancel_at",
            "book_item",
            "user",
        )
        read_only_fields = ("id",)


class MobileOrderSr(ModelSerializer):
    url = serializers.SerializerMethodField(read_only=True)

    def to_internal_value(self, data):
        is_update = getattr(self.instance, "pk", None) is not None

        if not is_update:
            try:
                book = Book.objects.get(id=data.get("book"))
            except Book.DoesNotExist:
                raise serializers.ValidationError(
                    {"book": "Invalid book_id. The book does not exist."}
                )

            book_items = BookItem.objects.filter(book_id=book.id)

            if not book_items:
                raise serializers.ValidationError({"detail": "book not available"})

            borrowing_book_item_ids = book_items.filter(
                order__status__in=consts.NOT_AVAILABLE_STATUS
            ).values_list("id", flat=True)

            book_item = book_items.exclude(id__in=borrowing_book_item_ids).first()

            if not book_item:
                raise serializers.ValidationError({"detail": "book not available"})

            data["book_item"] = book_item.id

            user = self.context["request"].user
            data["user"] = user.id

        if data.get("status") == consts.OrderStatus.CANCELED:
            data["cancel_at"] = datetime.datetime.now()

        return super().to_internal_value(data)

    def to_representation(self, instance):
        res = super().to_representation(instance)
        res["request_at"] = instance.request_at.strftime("%d-%m-%Y")
        res["approve_at"] = (
            instance.approve_at.strftime("%d-%m-%Y") if instance.approve_at else None
        )
        res["borrow_at"] = (
            instance.borrow_at.strftime("%d-%m-%Y") if instance.borrow_at else None
        )
        res["due_date"] = (
            instance.due_date.strftime("%d-%m-%Y") if instance.due_date else None
        )
        res["return_at"] = (
            instance.return_at.strftime("%d-%m-%Y") if instance.return_at else None
        )
        res["cancel_at"] = (
            instance.cancel_at.strftime("%d-%m-%Y") if instance.cancel_at else None
        )

        book = instance.book_item.book
        res["book_name"] = book.title
        res["price"] = book.price
        res["author"] = book.authors.first().name if book.authors.first() else None

        return res

    def get_url(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(f"/manages/{obj.id}")

    class Meta:
        model = Order
        fields = (
            "id",
            "status",
            "request_at",
            "approve_at",
            "borrow_at",
            "return_at",
            "cancel_at",
            "due_date",
            "book_item",
            "user",
            "url",
        )
        read_only_fields = ("id",)
