from typing import List, Any
import itertools


class CollectionService:
    @staticmethod
    def convert_list_to_string(value):
        return ", ".join(value) if isinstance(value, list) else value

    @staticmethod
    def convert_string_to_list(str_value):
        if isinstance(str_value, str):
            return [value.strip() for value in str_value.split(",")]
        return []

    @staticmethod
    def flat_2d_list(items: List[Any]) -> List[Any]:
        return list(set(itertools.chain.from_iterable(items)))

    @staticmethod
    def get_tuple_value(input_tuple, key, default_value=None):
        result_dict = dict(input_tuple)
        return result_dict.get(key, default_value)

    @staticmethod
    def is_boolean_dict(input_list: list) -> bool:
        return (
            all(isinstance(item, bool) for item in input_list.values())
            if input_list.values()
            else False
        )
