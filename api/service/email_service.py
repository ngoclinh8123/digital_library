from service.framework_service import settings, EmailMultiAlternatives
from service.error_service import ErrorService
from service.async_service import async_task


class EmailService:
    @staticmethod
    def send_email(subject, body, to):
        try:
            if settings.EMAIL_ENABLE is not True or settings.TESTING:
                return
            if not isinstance(to, list):
                to = [str(to)]
            email = EmailMultiAlternatives(
                subject, body, settings.DEFAULT_FROM_EMAIL, to
            )
            email.content_subtype = "html"
            email.attach_alternative(body, "text/html")
            result = email.send()
            return (email, result)
        except Exception as e:  # skipcq: Sending email can be failed
            print(ErrorService.return_exception(e))
            return e

    @staticmethod
    @async_task
    def send_email_async(*args):
        EmailService.send_email(*args)
