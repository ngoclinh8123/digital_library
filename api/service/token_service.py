from typing import Union
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from service.framework_service import get_user_model
from custom_type import query_obj

User = get_user_model()


class TokenService:
    @staticmethod
    def get_token_from_headers(headers: dict, is_jwt=True):
        prefix = "JWT " if is_jwt else "bearer "
        full_token = headers.get("Authorization")
        if not full_token:
            return ""
        token_arr = full_token.split(" ")
        if len(token_arr) != 2:
            return ""
        prefix = token_arr[0]
        token = token_arr[1]

        return "" if not token or prefix not in ["bearer", "JWT"] else token

    @staticmethod
    def get_token_signature(token: str) -> str:
        return token.split(".")[-1]

    @staticmethod
    def refresh(refresh_token: str) -> str:
        try:
            return str(RefreshToken(refresh_token).access_token)
        except Exception:  # skipcq: whatever error
            return ""

    @staticmethod
    def generate(user: query_obj) -> str:
        return str(RefreshToken.for_user(user))

    @staticmethod
    def get_token_from_username(username: str) -> str:
        try:
            user = User.objects.get(username=username)
            return TokenService.generate(user)
        except Exception:  # skipcq: whatever error
            return ""

    @staticmethod
    def get_user_from_token(token: str) -> Union[query_obj, None]:
        try:
            jwt_auth = JWTAuthentication()
            validated_token = jwt_auth.get_validated_token(token)
            return jwt_auth.get_user(validated_token)
        except Exception as e:  # skipcq: whatever error
            print(repr(e))
            return None
