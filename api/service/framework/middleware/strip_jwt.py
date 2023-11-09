import contextlib
from service.framework_service import translation
from rest_framework.permissions import AllowAny
from service.token_service import TokenService


class StripJWT:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_view(self, request, view_func, _view_args, _view_kwargs):
        lang = request.headers.get("Accept-Language", "en")
        translation.activate(lang)
        if request.headers.get("Authorization"):
            token = TokenService.get_token_from_headers(request.headers)
            bearer_token = f"bearer {token}"

            with contextlib.suppress(AttributeError):
                if AllowAny in view_func.view_class.permission_classes and token:
                    # request.META.pop("HTTP_AUTHORIZATION", None)
                    request.META["HTTP_AUTHORIZATION"] = bearer_token
