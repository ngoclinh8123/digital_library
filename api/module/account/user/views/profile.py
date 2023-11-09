from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ..helper.sr import UserSr
from service.request_service import RequestService
from module.account.user.helper.util import UserUtil


class ProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_user(self):
        return self.request.user

    def get(self, request):
        user = self.get_user()
        data = UserSr(user).data
        return RequestService.res(data)

    def put(self, request):
        user = self.get_user()
        data = request.data
        user = UserUtil.update_user(user, data)
        sr = UserSr(user)
        return RequestService.res(sr.data)