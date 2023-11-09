from django.test import SimpleTestCase

# from service.helper.util import Util

# Create your tests here.

"""
class GetNextUidOrder(SimpleTestCase):
    def test_normal_case(self):
        uid = "1HN001A5"
        output = Util.get_next_uid_index(uid)
        eput = 6
        self.assertEqual(output, eput)

    def test_missing_uid(self):
        uid = ""
        output = Util.get_next_uid_index(uid)
        eput = 1
        self.assertEqual(output, eput)


class IsSemiContain(SimpleTestCase):
    def test_normal_case(self):
        parent = [1, 2, 3]
        child = [1, 6]
        output = Util.is_semi_contain(parent, child)
        eput = True
        self.assertEqual(output, eput)

    def test_normal_case_but_child_larger_than_parent(self):
        parent = [1, 2, 3]
        child = [1, 6, 3, 5]
        output = Util.is_semi_contain(parent, child)
        eput = True
        self.assertEqual(output, eput)

    def test_sub_set(self):
        parent = [1, 2, 3]
        child = [1, 3]
        output = Util.is_semi_contain(parent, child)
        eput = False
        self.assertEqual(output, eput)

    def test_no_intersection(self):
        parent = [1, 2, 3]
        child = [4, 5]
        output = Util.is_semi_contain(parent, child)
        eput = False
        self.assertEqual(output, eput)


class RemoveSpecialChars(SimpleTestCase):
    def test_normal_case(self):
        input_data = "abc"
        output = Util.remove_special_chars(input_data)
        eput = "abc"
        self.assertEqual(output, eput)

    def test_special_case(self):
        input_data = " abc* "
        output = Util.remove_special_chars(input_data)
        eput = "abc"
        self.assertEqual(output, eput)

    def test_special_case_upper(self):
        input_data = " abc* "
        output = Util.remove_special_chars(input_data, True)
        eput = "ABC"
        self.assertEqual(output, eput)


class PasswordValidate(SimpleTestCase):
    def test_happy_case(self):
        input_data = "1Abcdefg"
        output = Util.password_validate(input_data)
        eput = []
        self.assertEqual(output, eput)

    def test_too_short(self):
        input_data = "1Abcdef"
        output = Util.password_validate(input_data)
        self.assertEqual(len(output), 1)

    def test_no_number(self):
        input_data = "Abcdefgh"
        output = Util.password_validate(input_data)
        self.assertEqual(len(output), 1)

    def test_no_upper(self):
        input_data = "1abcdefgh"
        output = Util.password_validate(input_data)
        self.assertEqual(len(output), 1)


class DigitToBool(SimpleTestCase):
    def test_happy_case_str_0(self):
        input_data = "0"
        output = Util.to_bool(input_data)
        eput = False
        self.assertEqual(output, eput)

    def test_happy_case_str_1(self):
        input_data = "1"
        output = Util.to_bool(input_data)
        eput = True
        self.assertEqual(output, eput)

    def test_happy_case_int_0(self):
        input_data = 0
        output = Util.to_bool(input_data)
        eput = False
        self.assertEqual(output, eput)

    def test_happy_case_int_1(self):
        input_data = 1
        output = Util.to_bool(input_data)
        eput = True
        self.assertEqual(output, eput)

    def test_none(self):
        input_data = None
        output = Util.to_bool(input_data)
        eput = False
        self.assertEqual(output, eput)

    def test_empty_string(self):
        input_data = ""
        output = Util.to_bool(input_data)
        eput = False
        self.assertEqual(output, eput)

    def test_other_string(self):
        input_data = "hello"
        output = Util.to_bool(input_data)
        eput = True
        self.assertEqual(output, eput)

    def test_other_int(self):
        input_data = 3
        output = Util.to_bool(input_data)
        eput = True
        self.assertEqual(output, eput)


class DateStrStripMillisecs(SimpleTestCase):
    def test_happy_case(self):
        input_data = "2020-02-27T12:15:01.623+07:00"
        output = Util.date_str_strip_millisecs(input_data)
        eput = "2020-02-27T12:15:01+07:00"
        self.assertEqual(output, eput)

    def test_bad_format(self):
        input_data = "2020-2-27T12:15:01.623+07:00"
        output = Util.date_str_strip_millisecs(input_data)
        eput = None
        self.assertEqual(output, eput)

    def test_none(self):
        input_data = None
        output = Util.date_str_strip_millisecs(input_data)
        eput = None
        self.assertEqual(output, eput)


class MaskPhoneNumber(SimpleTestCase):
    def test_happy_case(self):
        input_data = "+84906696527"
        output = Util.mask_prefix(input_data)
        eput = "********6527"
        self.assertEqual(output, eput)

    def test_happy_case_1(self):
        input_data = "+84906696527"
        mask_length = 5
        output = Util.mask_prefix(input_data, mask_length)
        eput = "*******96527"
        self.assertEqual(output, eput)

    def test_happy_case_2(self):
        input_data = "+84906696527"
        mask_length = 6
        output = Util.mask_prefix(input_data, mask_length)
        eput = "******696527"
        self.assertEqual(output, eput)


class MaskEmail(SimpleTestCase):
    def test_name_1(self):
        input_data = "a@gmail.com"
        output = Util.mask_email(input_data)
        eput = "*@gmail.com"
        self.assertEqual(output, eput)

    def test_name_2(self):
        input_data = "ab@gmail.com"
        output = Util.mask_email(input_data)
        eput = "*b@gmail.com"
        self.assertEqual(output, eput)

    def test_name_3(self):
        input_data = "abc@gmail.com"
        output = Util.mask_email(input_data)
        eput = "*bc@gmail.com"
        self.assertEqual(output, eput)

    def test_name_4(self):
        input_data = "abcd@gmail.com"
        output = Util.mask_email(input_data)
        eput = "**cd@gmail.com"
        self.assertEqual(output, eput)

    def test_name_5(self):
        input_data = "abcde@gmail.com"
        output = Util.mask_email(input_data)
        eput = "*bcde@gmail.com"
        self.assertEqual(output, eput)

    def test_name_6(self):
        input_data = "abcdef@gmail.com"
        output = Util.mask_email(input_data)
        eput = "**cdef@gmail.com"
        self.assertEqual(output, eput)

    def test_name_7(self):
        input_data = "abcdefg@gmail.com"
        output = Util.mask_email(input_data)
        eput = "***defg@gmail.com"
        self.assertEqual(output, eput)


class IsBooleanDict(SimpleTestCase):
    def test_all_boolean(self):
        input_data = {
            "key1": True,
            "key2": False,
            "key3": True,
        }
        output = Util.is_boolean_dict(input_data)
        eput = True
        self.assertEqual(output, eput)

    def test_some_boolean(self):
        input_data = {
            "key1": True,
            "key2": None,
            "key3": True,
        }
        output = Util.is_boolean_dict(input_data)
        eput = False
        self.assertEqual(output, eput)

    def test_empty(self):
        input_data = {}
        output = Util.is_boolean_dict(input_data)
        eput = False
        self.assertEqual(output, eput)


class EnsureSpaceSlash(SimpleTestCase):
    def test_happy_case(self):
        input_data = "abc/def"
        output = Util.ensure_space_slash(input_data)
        eput = "abc / def"
        self.assertEqual(output, eput)

        input_data = "Quy trình/ dịch vụ/ sản phẩm"
        output = Util.ensure_space_slash(input_data)
        eput = "Quy trình / dịch vụ / sản phẩm"
        self.assertEqual(output, eput)


class GetTupleValue(SimpleTestCase):
    def test_happy_case(self):
        input_tuple = (
            ("key1", "value1"),
            ("key2", "value2"),
        )
        key = "key1"
        output = Util.get_tuple_value(input_tuple, key)
        eput = "value1"
        self.assertEqual(output, eput)

    def test_not_found(self):
        input_tuple = (
            ("key1", "value1"),
            ("key2", "value2"),
        )
        key = "key3"
        output = Util.get_tuple_value(input_tuple, key)
        eput = None
        self.assertEqual(output, eput)

    def test_not_found_with_default(self):
        input_tuple = (
            ("key1", "value1"),
            ("key2", "value2"),
        )
        key = "key3"
        output = Util.get_tuple_value(input_tuple, key, "hello")
        eput = "hello"
        self.assertEqual(output, eput)
"""
