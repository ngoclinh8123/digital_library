import django_filters

from ..models import User


class UserFilter(django_filters.FilterSet):
    email = django_filters.CharFilter(lookup_expr='contains')

    class Meta:
        model = User
        fields = ("email",)
