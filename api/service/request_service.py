from custom_type import query_set
from service.framework_service import _, settings, HttpResponse, Permission
from rest_framework.response import Response
from rest_framework import status
from rest_framework.serializers import ValidationError
from service.token_service import TokenService
from service.date_service import DateService


class RequestService:
    @staticmethod
    def jwt_response_handler(token, refresh_token, user):
        error_message = _("This user didn't associate with any profile.")
        try:
            data = {
                "token": token,
                "refresh_token": refresh_token,
                # "user_type": "staff" if hasattr(user, "staff") else "",
            }

            # if not data["user_type"]:
            #     raise ValidationError({"detail": error_message})

            user.refresh_token_signature = TokenService.get_token_signature(
                refresh_token
            )
            user.last_login = DateService.now()
            user.save()
            data["permissions"] = RequestService.get_grouped_permission(user)

            return data
        except Exception as e:
            print(repr(e))
            raise ValidationError({"detail": error_message}) from e

    @staticmethod
    def get_grouped_permission(user):
        ignore_permission_groups = [
            "logentry",
            "permission",
            "contenttype",
            "token",
            "tokenproxy",
            "session",
            "user",
            "whitelisttarget",
            "verif",
            "veriflog",
        ]
        group_ids = user.groups.values_list("id", flat=True)
        queryset = Permission.objects.all()
        if user.is_staff:
            queryset = Permission.objects.filter(group__in=group_ids).distinct()
        list_item = queryset.values_list("codename", flat=True)
        result = {}
        for item in list_item:
            group = item.split("_")[-1]
            if group not in ignore_permission_groups:
                permission = item[: -len(group) - 1]
                result[group] = result.get(group, []) + [permission]
        return result

    @staticmethod
    def get_visible_menus(groups: list[query_set]) -> list[str]:
        result = []
        for group in groups:
            permissions = group.permissions.filter(codename__startswith="view_")
            for pem in permissions:
                codename_arr = pem.codename.split("_")
                if len(codename_arr) != 2:
                    continue
                menu = codename_arr[1]
                if menu not in result:
                    result.append(menu)
        return result

    @staticmethod
    def get_all_menus() -> list[str]:
        result = []
        permissions = Permission.objects.all()
        for pem in permissions:
            codename_arr = pem.codename.split("_")
            if len(codename_arr) != 2:
                continue
            menu = codename_arr[1]
            if menu not in result:
                result.append(menu)
        return result

    @staticmethod
    def error_format(data):
        if isinstance(data, str):
            return {"detail": data}
        return data if isinstance(data, dict) else {}

    @staticmethod
    def res(item=None, extra=None, **kwargs):
        if item is None:
            item = {}
        if extra is not None:
            item["extra"] = extra
        return Response(item, **kwargs)

    @staticmethod
    def err(data, status_code=status.HTTP_400_BAD_REQUEST):
        return Response(RequestService.error_format(data), status=status_code)

    @staticmethod
    def error_response_to_string(error_response: dict) -> list:
        result = []
        for _status, value in error_response.items():
            if isinstance(value, str) and value:
                result.append(value)
            if isinstance(value, list) and value:
                result += value
        return result

    @staticmethod
    def get_excel_response(virtual_workbook, filename):
        response = HttpResponse(
            content=virtual_workbook,
            content_type="application/ms-excel",
        )
        response["Content-Disposition"] = f"attachment; filename={filename}"
        return response

    @staticmethod
    def get_base_url():
        return f"{settings.PROTOCOL}://{settings.DOMAIN}/"

    @staticmethod
    def get_lang_code(request) -> str:
        lang_code = request.META.get("HTTP_ACCEPT_LANGUAGE", settings.LANGUAGE_CODE)
        if lang_code not in ["en-us", "vi-vn"]:
            lang_code = settings.LANGUAGE_CODE
        return lang_code

    @staticmethod
    def get_ip_list(request):
        ips = request.META.get("HTTP_X_FORWARDED_FOR", "")
        return [x.strip() for x in ips.split(",")]


JWT_RESPONSE_HANDLER = RequestService.jwt_response_handler
