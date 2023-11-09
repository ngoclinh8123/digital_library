import sys
from django.db.models import QuerySet as _QuerySet
from django.conf import settings as _settings
from django.utils.text import slugify as _slugify
from django.utils import translation as _translation
from django.utils.translation import gettext_lazy

from django.contrib.auth import get_user_model as _get_user_model
from django.contrib.auth.hashers import make_password as _make_password
from django.contrib.auth.hashers import check_password as _check_password

from django.http import HttpResponse as _HttpResponse
from django.contrib.auth.models import Permission as _Permission
from django.contrib.auth.models import Group as _Group

from django.core.mail import EmailMultiAlternatives as _EmailMultiAlternatives

QuerySet = _QuerySet
settings = _settings
slugify = _slugify
translation = _translation
_ = gettext_lazy
get_user_model = _get_user_model
make_password = _make_password
check_password = _check_password
HttpResponse = _HttpResponse
Group = _Group
Permission = _Permission
EmailMultiAlternatives = _EmailMultiAlternatives


class FrameworkService:
    @staticmethod
    def is_testing():
        return len(sys.argv) > 1 and sys.argv[1] == "test"

    @staticmethod
    def get_settings():
        return settings
