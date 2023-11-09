import sys


class NumberService:
    @staticmethod
    def float_equal(float_1: float, float_2: float) -> bool:
        epsilon = sys.float_info.epsilon
        return abs(float_1 - float_2) <= epsilon
