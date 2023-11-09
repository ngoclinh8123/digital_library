import pytz
import contextlib
from datetime import date, datetime, timedelta
from service.framework_service import settings

MONTH_MAP = {
    1: 1,
    2: 1,
    3: 1,
    4: 2,
    5: 2,
    6: 2,
    7: 3,
    8: 3,
    9: 3,
    10: 4,
    11: 4,
    12: 4,
}

QUATER_MAP = {
    1: [1, 2, 3],
    2: [4, 5, 6],
    3: [7, 8, 9],
    4: [10, 1, 12],
}


class DateService:
    @staticmethod
    def now(aware=False) -> datetime:
        result = datetime.now()
        return DateService.make_aware(result) if aware else result

    @staticmethod
    def today(aware=False) -> date:
        result = date.today()
        return DateService.make_aware(result) if aware else result

    @staticmethod
    def shift_from_now(unit: str, value: int, aware=False):
        params = {unit: value}
        start_date = DateService.now(aware)
        return start_date + timedelta(**params)

    @staticmethod
    def shift_from_today(unit: str, value: int, aware=False):
        params = {unit: value}
        start_date = DateService.today(aware)
        return start_date + timedelta(**params)

    @staticmethod
    def make_aware(input_datetime: datetime) -> datetime:
        if not input_datetime:
            return input_datetime
        tz = pytz.timezone(settings.TIME_ZONE)
        return tz.localize(input_datetime)

    @staticmethod
    def str_to_datetime(date_str: str, aware=False):
        format_str = settings.STANDARD_DATETIME_FORMAT
        result = None
        with contextlib.suppress(Exception):
            date_str = DateService.format_datetime_str(date_str)
            result = datetime.strptime(date_str, format_str)
        return DateService.make_datetime_aware(result) if aware else result

    @staticmethod
    def str_to_date(date_str: str):
        if not date_str:
            return None

        if "T" in date_str:
            date_str = date_str.split("T")[0]
        if " " in date_str:
            date_str = date_str.split(" ")[0]

        try:
            result = datetime.strptime(date_str, settings.STANDARD_DATE_FORMAT)
            return result.date()
        except Exception:  # skipcq: whatever error
            return None

    @staticmethod
    def readable_str_to_date(date_str):
        if isinstance(date_str, date):
            return date_str
        try:
            format_str = settings.READABLE_DATE_FORMAT
            return datetime.strptime(date_str, format_str)
        except Exception:  # skipcq: whatever error
            try:
                format_str = settings.STANDARD_DATETIME_FORMAT
                return datetime.strptime(date_str, format_str)
            except Exception:  # skipcq: whatever error
                return None

    @staticmethod
    def str_to_readable_date_str(date_str: str) -> str:
        try:
            date_obj = DateService.str_to_datetime(date_str)
            return DateService.date_to_readable_str(date_obj)
        except Exception:  # skipcq: Whatever error, return None
            return None

    @staticmethod
    def date_to_readable_str(date_obj, only_date=False) -> str:
        if isinstance(date_obj, datetime):
            return (
                date_obj.strftime(settings.READABLE_DATE_FORMAT)
                if only_date
                else date_obj.strftime(settings.READABLE_DATETIME_FORMAT)
            )

        if isinstance(date_obj, date):
            return date_obj.strftime(settings.READABLE_DATE_FORMAT)
        return ""

    @staticmethod
    def date_to_readble_str(date_obj: date, long_year=True) -> str:
        if not date_obj:
            return None
        if long_year:
            return date_obj.strftime("%d/%m/%Y")
        return date_obj.strftime("%d/%m/%y")

    @staticmethod
    def datetime_to_readble_str(datetime_obj: datetime, long_year=True) -> str:
        if not datetime_obj:
            return None
        if long_year:
            return datetime_obj.strftime("%d/%m/%Y %H:%M:%S")
        return datetime_obj.strftime("%d/%m/%y %H:%M:%S")

    @staticmethod
    def get_str_day(input_date: date) -> str:
        return input_date.strftime("%d")

    @staticmethod
    def get_str_month(input_date: date) -> str:
        month_str = input_date.strftime("%m")
        month_str_map = {
            "01": "A",
            "02": "B",
            "03": "C",
            "04": "D",
            "05": "E",
            "06": "F",
            "07": "G",
            "08": "H",
            "09": "I",
            "10": "J",
            "11": "K",
            "12": "L",
        }
        return month_str_map[month_str]

    @staticmethod
    def get_str_day_month(input_date: date) -> str:
        date_dd = DateService.get_str_day(input_date)
        date_m = DateService.get_str_month(input_date)
        return f"{date_dd}{date_m}"

    @staticmethod
    def date_str_strip_millisecs(input_str: str) -> str:
        # 2020-02-27T12:15:01.623+07:00
        if not isinstance(input_str, str):
            return None
        if input_str.find(".") == 19 and input_str.find("+") == 23:
            date_arr = input_str.split(".")
            first_part = date_arr[0]
            second_part = date_arr[1][3:]
            return first_part + second_part
        return None

    @staticmethod
    def get_current_quater() -> int:
        month = DateService.today().month
        return MONTH_MAP.get(month)

    @staticmethod
    def get_quater_from_month(month: int) -> int:
        return MONTH_MAP.get(month)

    @staticmethod
    def get_months_from_quater(quater: int) -> list[int]:
        return QUATER_MAP[quater]

    @staticmethod
    def show_diff_in_secs() -> float:
        input_time = DateService.now()

        def inner(label: str):
            diff = (DateService.now() - input_time).total_seconds()
            print(f"[+] {label} - {diff} secs")
            return diff

        return inner
