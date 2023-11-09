import os
from rest_framework import routers
from django.urls import path
from .views.crud import BookViewSet
from .views.crud_book_item import BookItemViewSet
from .views.order import OrderViewSet, MobileOrderViewSet

app_name = os.getcwd().split(os.sep)[-1]
router = routers.DefaultRouter()
router.register(r'book', BookViewSet, basename='book')
router.register(r'order', OrderViewSet, basename='order')
router.register(r'mobile/order', MobileOrderViewSet, basename='mobile-order')

PK_ENDPOINT = BookItemViewSet.as_view(
    {"post": "update","get": "list"}
)

urlpatterns = [
    path("item/<int:pk>", PK_ENDPOINT),
]

urlpatterns += router.urls