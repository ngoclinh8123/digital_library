from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import Group


class GroupSr(ModelSerializer):
    class Meta:
        model = Group
        fields = [
            "id",
            "name",
        ]
        read_only_fields = ("id",)

    def create(self, validated_data):
        permission_source = self.initial_data.get("permissions", "")
        permissions = [
            int(permission)
            for permission in permission_source.split(",")
            if permission.isdigit()
        ]

        group = Group(**validated_data)
        group.save()
        group.permissions.set(permissions)

        return group
