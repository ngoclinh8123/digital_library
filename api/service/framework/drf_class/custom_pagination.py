from math import ceil
from service.framework_service import settings
from rest_framework import pagination
from rest_framework.response import Response


class CustomPagination(pagination.PageNumberPagination):
    # page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        next_link = self.get_next_link()
        previous_link = self.get_previous_link()

        extra = {}
        if isinstance(data, dict):
            items = data.get("items", [])
            extra = data.get("extra", {})
        else:
            items = data

        return Response(
            {
                "links": {"next": next_link, "previous": previous_link},
                "count": self.page.paginator.count,
                "pages": ceil(self.page.paginator.count / self.page_size),
                "page_size": self.page_size,
                "extra": extra,
                "items": items,
            }
        )


class NoPaginationStatic:
    @staticmethod
    def get_paginated_response(data):
        extra = {}
        items = []
        if isinstance(data, dict):
            items = data.get("items", [])
            extra = data.get("extra", {})
        else:
            items = data

        page_size = len(items)
        return Response(
            {
                "links": {"next": "", "previous": ""},
                "count": page_size,
                "pages": 1,
                "page_size": page_size,
                "extra": extra,
                "items": items,
            }
        )


class NoPagination(pagination.PageNumberPagination):
    def get_paginated_response(self, data):
        return NoPaginationStatic.get_paginated_response(data)


class CustomLimitOffsetPagination(pagination.LimitOffsetPagination):
    def get_paginated_response(self, data):
        next_link = self.get_next_link()
        previous_link = self.get_previous_link()

        extra = {}
        items = []
        if isinstance(data, dict):
            items = data.get("items", [])
            extra = data.get("extra", {})
        else:
            items = data
        if settings.PROTOCOL == "https":
            if next_link:
                next_link = next_link.replace(HTTP_PROTOCOL, HTTPS_PROTOCOL)
            if previous_link:
                previous_link = previous_link.replace(HTTP_PROTOCOL, HTTPS_PROTOCOL)

        return Response(
            {
                "links": {"next": next_link, "previous": previous_link},
                "extra": extra,
                "items": items,
            }
        )
