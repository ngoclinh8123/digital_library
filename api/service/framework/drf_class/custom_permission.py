from rest_framework import permissions


class CustomPermission(permissions.BasePermission):
    def has_permission(self, request, view):

        action = view.action
        name = getattr(view, "_name")

        if request.user.is_staff is False:
            return True

        if not action or not name:
            return False

        alias = {
            "view": ["list", "retrieve"],
            "delete": ["delete", "delete_list"],
            "add": [],
            "change": [],
        }

        custom_alias = getattr(
            view,
            "_permission_alias",
            {},
        )

        for key, value in custom_alias.items():
            alias[key] = alias[key] + value if key in alias else value

        for main_action, value_ in alias.items():
            if action in value_:
                action = main_action
                break

        name = "group" if name == "role" else name
        name = name.replace("_", "")

        permission = f"{action}_{name}"

        is_allow = False

        if request.user.user_permissions.filter(codename=permission).count():
            is_allow = True

        if request.user.groups.filter(permissions__codename=permission).count():
            is_allow = True

        return is_allow
