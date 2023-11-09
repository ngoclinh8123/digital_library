import contextlib
from django.contrib.auth.hashers import make_password, check_password
from module.account.user.helper.sr import SignupSr
from service.format_service import FormatService
from service.framework_service import _
from django.db import transaction
from django.contrib.auth import get_user_model

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

from service.string_service import StringService
from service.request_service import RequestService
from service.token_service import TokenService

from module.noti.verif.helper.util import VerifUtil
from module.account.user.helper.util import UserUtil

User = get_user_model()


class LoginView(TokenObtainPairView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        error_message = "Incorrect login information. Please try again"
        try:
            response = super().post(request, *args, **kwargs)
        except Exception:  # skipcq: Catch every error when login
            return RequestService.err(error_message)
        if response.status_code not in range(200, 300):
            return RequestService.err(error_message)
        refresh_token = response.data.get("refresh")
        token = response.data.get("access")
        user = TokenService.get_user_from_token(token)
        response = RequestService.jwt_response_handler(token, refresh_token, user)
        return RequestService.res(response)


class RefreshTokenView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh_token")
        token = TokenService.refresh(refresh_token)
        if not token:
            error_message = _("Can not refresh token")
            return RequestService.err(error_message)
        return RequestService.res({"token": token})


class RefreshCheckView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return RequestService.res({})


class LogoutView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        with contextlib.suppress(Exception):
            token = TokenService.get_token_from_headers(request.headers, False)
            user = TokenService.get_user_from_token(token)
            user.refresh_token_signature = ""
            user.save()
        return RequestService.res({})


class ResetPasswordView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        params = self.request.data
        email = params.get("email", "").lower()
        print(email)
        lang = RequestService.get_lang_code(request)
        try:
            user = UserUtil.get_user_by_email(email)
            if not user:
                raise Exception("Email không tồn tại trong hệ thống!")
            password = StringService.generate_random_password()
            user.password = make_password(password)
            user.save()
            UserUtil.send_new_password_email(email, password, lang)
            return RequestService.res({})
        except Exception as e:
            print(repr(e))
            return RequestService.err(e)


class ChangePasswordView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def post(self, request):
        params = self.request.data

        user = self.get_object()

        old_password = params.get("old_password", 0)
        password = params.get("password", "")
        password_confirm = params.get("password_confirm", "")

        if password != password_confirm:
            return RequestService.err(
                {"password_confirm": _("Password and confirm password didn't match")}
            )

        if not old_password or check_password(old_password, user.password) is False:
            return RequestService.err({"old_password": _("Incorrect current password")})

        user.password = make_password(password)
        user.save()

        return RequestService.res({})

class SignupView(APIView):
    permission_classes = (AllowAny,)

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        user = UserUtil.signup(request.data)
        return RequestService.res(user)