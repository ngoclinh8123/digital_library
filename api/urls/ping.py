from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions


class PingAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        result = {"message": "pong"}
        return Response(result)
