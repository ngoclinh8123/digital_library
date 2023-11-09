from typing import List
from datetime import datetime, timedelta
from service.framework_service import _
from django.template.loader import render_to_string
from service.framework_service import settings
from service.request_service import RequestService
from service.email_service import EmailService
from service.string_service import StringService
from module.conf.variable.models import Variable
from module.noti.verif.models import Verif, VerifLog, WhitelistTarget


class VerifUtil:
    @staticmethod
    def get_default_otp():
        return "123456"

    @staticmethod
    def get_subject():
        return _(f"{settings.APP_TITLE} - Verification code")

    @staticmethod
    def get_error_message():
        return _("You have entered incorrect OTP so many times. Please try again later")

    @staticmethod
    def send_confirmation_email(subject, to_email, verification_code, lang):
        body = render_to_string(
            f"emails/signup/{lang}.html",
            {
                "base_url": RequestService.get_base_url(),
                "verification_code": verification_code,
            },
        )

        EmailService.send_email_async(subject, body, to_email)

    @staticmethod
    def send_noti_after_creating_email(subject: str, to_email: str):
        body = render_to_string(
            "emails/noti_after_creating.html",
            {"login_url": f"{RequestService.get_base_url()}#/login"},
        )

        EmailService.send_email_async(subject, body, to_email)

    @staticmethod
    def create(ips: List[str], target: str, lang: str = "vi"):
        try:
            in_whitelist = VerifUtil.in_whitelist(target)

            code = StringService.get_random_digits()
            uid = StringService.get_uuid()

            if in_whitelist or settings.TESTING:
                code = VerifUtil.get_default_otp()

            if not settings.TESTING and not VerifUtil.write_log(ips, target):
                return (False, VerifUtil.get_error_message())

            Verif.objects.create(uid=uid, code=code, target=target)

            if in_whitelist or settings.TESTING:
                return (True, uid)

            subject = VerifUtil.get_subject()
            VerifUtil.send_confirmation_email(subject, target, code, lang)

            return (True, uid)
        except Exception:  # skipcq: whatever error
            return (False, VerifUtil.get_error_message())

    @staticmethod
    def create_again(ips: List[str], uid: str, lang: str = "vi"):
        error_message = _("Can not send OTP, please try again after 90 seconds")

        if not uid:
            return (False, error_message)

        item = Verif.objects.filter(uid=uid).order_by("-id").first()

        if not item:
            return (False, error_message)

        in_whitelist = VerifUtil.in_whitelist(item.target)

        today = datetime.now()
        diff = today - item.updated_at
        diff_seconds = diff.total_seconds()

        if diff_seconds <= settings.VERIFICATION_CODE_EXPIRED_PERIOD:
            return (False, error_message)

        if in_whitelist or settings.TESTING:
            item.code = VerifUtil.get_default_otp()
        else:
            item.code = StringService.get_random_digits()

        if not VerifUtil.write_log(ips, item.target):
            return (False, VerifUtil.get_error_message())

        item.save()

        if in_whitelist or settings.TESTING:
            return (True, item.target)

        subject = VerifUtil.get_subject()
        VerifUtil.send_confirmation_email(subject, item.target, item.code, lang)

        return (True, item.target)

    @staticmethod
    def get(uid: str, code: str) -> str:
        try:
            if not uid or not code:
                return None

            item = Verif.objects.get(uid=uid, code=code)

            today = datetime.now()
            diff = today - item.updated_at
            diff_seconds = diff.total_seconds()

            if diff_seconds > settings.VERIFICATION_CODE_EXPIRED_PERIOD:
                return None

            return item
        except Verif.DoesNotExist:
            return None

    @staticmethod
    def in_whitelist(target):
        try:
            WhitelistTarget.objects.get(target=target)
            return True
        except WhitelistTarget.DoesNotExist:
            return False

    @staticmethod
    def write_log(ips: List[str], target: str):
        end_date = datetime.now()
        start_date = end_date - timedelta(days=1)

        count = VerifLog.objects.filter(
            ips__overlap=ips,
            target=target,
            created_at__gte=start_date,
            created_at__lte=end_date,
        ).count()

        max_count = int(Variable.objects.get_value("MAX_OTP_PER_TARGET_PER_DAY", "0"))
        if count > max_count:
            return None

        return VerifLog.objects.create(ips=ips, target=target)
