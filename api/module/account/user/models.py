from django.db import models
from service.framework_service import _
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField


class User(AbstractUser):
    email = models.EmailField(
        max_length=128, unique=True, null=True, blank=True, default=None
    )
    phone_number = PhoneNumberField(null=True, blank=True, default=None)
    refresh_token_signature = models.CharField(max_length=128, blank=True, default="")
    address = models.CharField(max_length=255, null=True, blank=True, default=None)
    avatar = models.ImageField(upload_to="users", null=True)

    @property
    def full_name(self) -> str:
        return f"{self.last_name} {self.first_name}".strip()

    def __str__(self):
        return self.email

    class Meta:
        db_table = "users"
        ordering = ["-id"]
        verbose_name = _("user")
