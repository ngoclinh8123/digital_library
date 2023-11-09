from django import forms
from django.contrib.auth.forms import (
    UserCreationForm,
    UserChangeForm,
)

from .models import User


class CustomUserCreationForm(UserCreationForm):
    email = forms.CharField(
        required=True,
        widget=forms.EmailInput(
            attrs={
                "class": "validate",
            }
        ),
    )

    class Meta:
        model = User
        fields = ("phone_number", "email")


class CustomUserChangeForm(UserChangeForm):
    email = forms.CharField(
        required=True,
        widget=forms.EmailInput(
            attrs={
                "class": "validate",
            }
        ),
    )

    class Meta:
        model = User
        fields = ("phone_number", "email")
