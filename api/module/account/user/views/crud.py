from rest_framework.viewsets import ModelViewSet
from ..helper.filter import UserFilter
from ..models import User
from ..helper.sr import UserSr


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSr
    filterset_class = UserFilter
    search_fields = ('username', 'email')
    ordering_fields = '__all__'
