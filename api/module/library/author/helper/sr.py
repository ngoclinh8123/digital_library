from rest_framework.serializers import ModelSerializer, CharField
from rest_framework.validators import UniqueValidator
from ..models import Author


class AuthorSr(ModelSerializer):
    class Meta:
        model = Author
        exclude = ()
        read_only_fields = ("id",)


