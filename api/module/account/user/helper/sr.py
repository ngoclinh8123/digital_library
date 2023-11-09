from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from rest_framework.validators import UniqueValidator
from service.format_service import FormatService
import re

User = get_user_model()


class UserSr(ModelSerializer):
    class Meta:
        model = User
        exclude = []

    email = serializers.CharField(
        validators=[
            UniqueValidator(queryset=User.objects.all(), message="Duplicate email")
        ]
    )

    def to_internal_value(self, data):
        # if "phone_number" in data:
        #     phone_number = data.get("phone_number")
        #     phone_number = FormatService.phone_to_canonical_format(phone_number)
        #     if not phone_number:
        #         phone_number = None
        #     data["phone_number"] = phone_number

        if "email" in data:
            email = data.get("email").lower()
            data["username"] = email
            data["email"] = email

        if "password" in data:
            data["password"] = make_password(data.get("password"))

        return super().to_internal_value(data)

    def to_representation(self, obj):
        res = super().to_representation(obj)

        exclude_fields = [
            "password",
            "refresh_token_signature",
            "is_superuser",
            "user_permissions",
            "date_joined",
            "last_login",
            "groups"
        ]

        for exclude_field in exclude_fields:
            res.pop(exclude_field, None)

        res["full_name"] = obj.full_name

        return res



class SignupSr(ModelSerializer):
    class Meta:
        model = User
        exclude = []
        
    email = serializers.CharField(
        validators=[
            UniqueValidator(queryset=User.objects.all(), message="Email đã tồn tại")
        ],
        required=False
    )
    name = serializers.CharField(max_length=150,required=False)
    username = serializers.CharField(
        validators=[
            UniqueValidator(queryset=User.objects.all(), message="Tên đăng nhập đã tồn tại")
        ],required=True
    )
    phone_number = serializers.CharField(max_length=50,required=False)
    password = serializers.CharField()
    
    def validate_password(self, password):
        if len(password) < 8:
            raise serializers.ValidationError("Mật khẩu phải có ít nhất 8 ký tự.")
        
        if not any(char.isdigit() for char in password):
            raise serializers.ValidationError("Mật khẩu phải bao gồm ký tự số.")
        
        if not any(char.isalpha() for char in password):
            raise serializers.ValidationError("Mật khẩu phải bao gồm ít nhất một ký tự chữ.")
        
        if not any(char.isupper() for char in password):
            raise serializers.ValidationError("Mật khẩu phải bao gồm ít nhất một ký tự chữ hoa.")
        
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            raise serializers.ValidationError("Mật khẩu phải bao gồm ít nhất một ký tự đặc biệt.")
        return make_password(password)
    
    def to_internal_value(self, data):
        if "phone_number" in data:
            phone_number = data.get("phone_number")
            phone_number = FormatService.phone_to_canonical_format(phone_number)
            if not phone_number:
                phone_number = None
            data["phone_number"] = phone_number
        data["last_name"] = data.get("name","Staff")
        data.pop("name", None)
        return super().to_internal_value(data)
    
    def to_representation(self, obj):
        return {
            "username": obj.username,
            "email": obj.email,
            "phone_number": str(obj.phone_number),
            "name": obj.last_name,
        }


