from custom_type import query_set, query_obj
from .sr import VariableSr
from ..models import Variable
from ..consts import SettingVariables


class VariableUtil:
    @staticmethod
    def seeding(index: int, single: bool = False, save: bool = True) -> query_set:
        if index == 0:
            raise Exception("Indext must be start with 1.")

        def get_data(i: int) -> dict:
            data = {"uid": f"uid{i}", "value": f"value{i}"}
            if not save:
                return data
            try:
                instance = Variable.objects.get(uid=data["uid"])
            except Variable.DoesNotExist:
                instance = VariableSr(data=data)
                instance.is_valid(raise_exception=True)
                instance = instance.save()
            return instance

        def get_list_data(index):
            return [get_data(i) for i in range(1, index + 1)]

        return get_data(index) if single else get_list_data(index)

    @staticmethod
    def settings_seeding(print_result):
        obj = SettingVariables()
        attributes = [
            a
            for a in dir(obj)
            if not a.startswith("__") and not callable(getattr(obj, a))
        ]
        for uid in attributes:
            try:
                Variable.objects.get(uid=uid)
            except Variable.DoesNotExist:
                value = getattr(SettingVariables, uid)
                print_result(uid, value)
                VariableUtil.set(uid, value)

    @staticmethod
    def get(uid: str, default_value: str = "") -> str:
        try:
            item = Variable.objects.get(uid=uid)
            return item.value
        except Variable.DoesNotExist:
            if hasattr(SettingVariables, uid):
                return getattr(SettingVariables, uid)
            return default_value

    @staticmethod
    def set(uid: str, value: str) -> query_obj:

        try:
            item = Variable.objects.get(uid=uid)
            item.value = value
            item.save()
            return item
        except Variable.DoesNotExist:
            return Variable.objects.create(uid=uid, value=value)
