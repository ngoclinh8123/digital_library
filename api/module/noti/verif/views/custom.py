from service.framework_service import _
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from service.request_service import RequestService
from service.string_service import StringService
from module.noti.verif.helper.util import VerifUtil


class CheckView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        verif_id = self.request.data.get("verif_id", "")
        otp_code = self.request.data.get("otp_code", "")
        error_message = _("Invalid OTP")

        if not verif_id or not otp_code:
            return RequestService.err({"detail": error_message})

        verif = VerifUtil.get(verif_id, otp_code)
        return (
            RequestService.res({"verif_id": verif_id, "otp_code": otp_code})
            if verif
            else RequestService.err({"detail": error_message})
        )


class ResendView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        verif_id = request.data.get("verif_id")
        ok, result = VerifUtil.create_again(
            RequestService.get_ip_list(request),
            verif_id,
            RequestService.get_lang_code(request),
        )
        return (
            RequestService.res(
                {"verif_id": verif_id, "username": StringService.apply_mask(result)}
            )
            if ok
            else RequestService.err(result)
        )
