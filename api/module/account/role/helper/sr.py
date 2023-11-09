from rest_framework.serializers import ModelSerializer, CharField
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import Group as Role


class RoleSr(ModelSerializer):
    class Meta:
        model = Role
        exclude = ()
        read_only_fields = ("id",)

    name = CharField(
        validators=[
            UniqueValidator(
                queryset=Role.objects.all(),
                message="Duplicate role",
            )
        ]
    )
