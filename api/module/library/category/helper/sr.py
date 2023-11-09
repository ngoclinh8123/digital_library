from rest_framework.serializers import ModelSerializer, CharField
from rest_framework.validators import UniqueValidator
from ..models import Category


class CategorySr(ModelSerializer):
    class Meta:
        model = Category
        exclude = ()
        read_only_fields = ("id",)


