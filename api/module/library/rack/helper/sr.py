from rest_framework.serializers import ModelSerializer, CharField
from rest_framework.validators import UniqueValidator
from django.core.exceptions import ValidationError
from ..models import Rack


class RackSr(ModelSerializer):
    class Meta:
        model = Rack
        exclude = ()
        read_only_fields = ("id",)
        
    def validate_number(self, value):
        if value <= 0:
            raise ValidationError("Number cannot be negative")
        return value
        
    def validate_location(self, value):
        if value <= 0:
            raise ValidationError("Number cannot be negative")
        return value


