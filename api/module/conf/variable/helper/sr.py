from rest_framework.serializers import ModelSerializer, CharField
from rest_framework.validators import UniqueValidator
from ..models import Variable


class VariableSr(ModelSerializer):
    class Meta:
        model = Variable
        exclude = ()
        read_only_fields = ("id",)

    uid = CharField(
        validators=[
            UniqueValidator(
                queryset=Variable.objects.all(),
                message="Duplicate variable",
            )
        ]
    )
