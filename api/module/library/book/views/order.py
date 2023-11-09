from rest_framework.viewsets import ModelViewSet

from service.framework.drf_class.custom_pagination import NoPagination
from ..models import Order
from ..helper.sr import OrderSr, MobileOrderSr


class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSr
    filterset_fields = ('status',)
    search_fields = ('user__first_name', 'user__last_name', 'user__phone_number', 'book_item__book__title')
    ordering_fields = '__all__'


class MobileOrderViewSet(ModelViewSet):
    serializer_class = MobileOrderSr
    filterset_fields = ('status',)
    search_fields = ('user__first_name', 'user__last_name', 'user__phone_number', 'book_item__book__title')
    pagination_class = NoPagination

    def get_queryset(self):
        user = self.request.user
        return Order.objects.filter(user=user)
