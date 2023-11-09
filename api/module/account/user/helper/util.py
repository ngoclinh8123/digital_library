from service.email_service import EmailService
from custom_type import query_obj
from service.framework_service import get_user_model, Group
from service.string_service import StringService
from .sr import UserSr,SignupSr
from django.template.loader import render_to_string

User = get_user_model()


class UserUtil:
    @staticmethod
    def get_default_test_pwd():
        return "SamplePassword123!@#"

    @staticmethod
    def create_user(data: dict) -> query_obj:
        if not data.get("password"):
            data["password"] = StringService.get_random_digits(12)
        sr = UserSr(data=data)
        sr.is_valid(raise_exception=True)
        user = sr.save()

        if "groups" in data:
            groups = [int(group) for group in data.get("groups", [])]
            if list(groups):
                group_list = Group.objects.filter(id__in=groups)
                for group in group_list:
                    group.user_set.add(user)
        return user

    @staticmethod
    def update_user(user: query_obj, data: dict) -> query_obj:
        user = user
        sr = UserSr(user, data=data, partial=True)
        sr.is_valid(raise_exception=True)
        user = sr.save()

        if "groups" in data:
            groups = [int(group) for group in data.get("groups", [])]
            for group in user.groups.all():
                group.user_set.remove(user)

            if list(groups):
                group_list = Group.objects.filter(id__in=groups)
                for group in group_list:
                    group.user_set.add(user)
        return user

    @staticmethod
    def get_user_by_username(username: str) -> query_obj:
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None
        
    @staticmethod
    def get_user_by_email(email: str) -> query_obj:
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            return None
        
    @staticmethod
    def send_new_password_email(to_email, password, lang):
        subject = (
            "[Thư viện Điện bàn] Thông báo cấp lại mật khẩu mới"
            if lang == "vi-vn"
            else "[Dien Ban library] Reset new password"
        )
        body = render_to_string(
            f"emails/reset_password/{lang}.html",
            {
                "password": password,
            },
        )
        EmailService.send_email_async(subject, body, to_email)
        
    @staticmethod
    def signup(data: dict) -> query_obj:
        sr = SignupSr(data=data)
        sr.is_valid(raise_exception=True)
        user = sr.save()

        if "groups" in data:
            groups = [int(group) for group in data.get("groups", [])]
            if list(groups):
                group_list = Group.objects.filter(id__in=groups)
                for group in group_list:
                    group.user_set.add(user)
        return sr.data
    
    
