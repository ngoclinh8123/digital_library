import string
import uuid
import random
import math
from service.framework_service import slugify


class StringService:
    @staticmethod
    def get_uuid():
        return str(uuid.uuid4())

    @staticmethod
    def remove_special_chars(input_str: str, upper: bool = False) -> str:
        result = slugify(input_str).replace("-", "").strip()
        return result.upper() if upper else result

    @staticmethod
    def str_to_uid(input_str: str, upper: bool = False) -> str:
        result = slugify(input_str).replace("-", "_").strip()
        return result.upper() if upper else result

    @staticmethod
    def get_random_digits(string_length=6) -> str:
        letters = "0123456789"
        return "".join(random.choice(letters) for _ in range(string_length))

    @staticmethod
    def ensure_space_slash(input_str: str) -> str:
        return input_str.replace("/", " / ").replace("  ", " ")

    @staticmethod
    def mask_prefix(input: str, mask_length=4) -> str:
        remain = input[-mask_length:]
        prefix = "*" * (len(input) - mask_length)
        return f"{prefix}{remain}"

    @staticmethod
    def mask_email(email: str) -> str:
        email_arr = email.split("@")
        suffix = email_arr[1]
        name = email_arr[0]
        length = len(name)

        if length == 1:
            return f"*@{suffix}"

        mask_length = math.ceil(length / 2) if length <= 4 else 4
        name = StringService.mask_prefix(name, mask_length)

        return f"{name}@{suffix}"

    @staticmethod
    def apply_mask(input_str: str) -> str:
        if "@" in input_str:
            return StringService.mask_email(input_str)
        return StringService.mask_prefix(input_str)
    
    @staticmethod
    def generate_random_password(k=8):
        characters = string.ascii_letters + string.digits
        
        special_characters = string.punctuation
        
        characters += special_characters
        
        password = random.choice(special_characters) + random.choice(string.digits)
        
        remaining_length = 8 - len(password)
        
        password += ''.join(random.choices(characters, k=remaining_length))
        
        if not any(char.isupper() for char in password):
            
            random_index = random.randint(0, len(password) - 1)
            
            password = password[:random_index] + random.choice(string.ascii_uppercase) + password[random_index + 1:]
            
        return password
