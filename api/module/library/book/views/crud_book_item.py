from django.db import transaction
from rest_framework.viewsets import ModelViewSet
from ..models import BookItem
from rest_framework import status
from ..helper.sr import BookItemSr
from rest_framework.permissions import IsAuthenticated,AllowAny
from service.request_service import RequestService
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet
from django.shortcuts import get_object_or_404


class BookItemViewSet(GenericViewSet):
    _name = "BookItemSr"
    serializer_class = BookItemSr
    permission_classes = (IsAuthenticated,)
    
    @transaction.atomic
    @action(methods=["post"], detail=True)
    def update(self, request,pk=None):
        book_items =  BookItem.objects.filter(book=pk)
        new_items = []
        update_ids = []
        update_items = []
        for item in request.data:
            if 'id' in item:
                update_items.append(item)
                update_ids.append(item['id'])
            else:
                new_items.append(item)
        book_items.exclude(id__in=update_ids).delete()
        serializer_create = BookItemSr(data=new_items,many=True)
        serializer_create.is_valid(raise_exception=True)
        serializer_create.save()
        
        for update_item in update_items:
            obj = book_items.get(pk=update_item['id'])
            serializer_update = BookItemSr(obj, data=update_item)
            serializer_update.is_valid(raise_exception=True)
            serializer_update.save()
        return RequestService.res(status=status.HTTP_204_NO_CONTENT)
    
    @action(methods=["get"], detail=True)
    def list(self, request,pk=None):
        book_items =  BookItem.objects.filter(book=pk)
        serializer = BookItemSr(book_items,many=True)
        return RequestService.res(serializer.data)
