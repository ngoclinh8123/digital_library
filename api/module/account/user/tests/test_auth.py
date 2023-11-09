import json
from rest_framework.test import APIClient
from django.test import TestCase
from module.account.user.helper.util import UserUtil
from module.account.staff.helper.util import StaffUtil
from module.noti.verif.helper.util import VerifUtil


class StaffTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.anonClient = APIClient()
        self.base_url = "/api/v1/account/user/"

    def test_reset_password(self):
        staff = StaffUtil.seeding(1, True)
        data = {
            "username": staff.user.username,
        }
        # Step 1 -> request OTP
        resp = self.client.post(
            f"{self.base_url}reset-password/",
            json.dumps(data),
            content_type="application/json",
        )

        status_code = resp.status_code
        resp = resp.json()
        verif_id = resp["verif_id"]
        self.assertEqual(status_code, 200)
        self.assertTrue("verif_id" in resp)
        self.assertTrue("username" in resp)

        # Step 2 -> check OTP
        otp_payload = {
            "verif_id": verif_id,
            "otp_code": VerifUtil.get_default_otp(),
        }
        resp = self.client.post(
            "/api/v1/noti/verif/check/",
            json.dumps(otp_payload),
            content_type="application/json",
        )
        status_code = resp.status_code
        self.assertEqual(status_code, 200)

        # Step 3 -> verify
        password_payload = {"password": "Qwerty!@#4567890"}
        payload = password_payload | otp_payload

        resp = self.client.post(
            f"{self.base_url}reset-password/",
            json.dumps(payload),
            content_type="application/json",
        )

        status_code = resp.status_code
        resp = resp.json()
        self.assertEqual(status_code, 200)
        self.assertEqual(resp, {})

        # Step 4 -> login
        resp = self.client.post(
            f"{self.base_url}login/",
            json.dumps(
                {
                    "username": staff.user.username,
                    "password": password_payload["password"],
                }
            ),
            content_type="application/json",
        )

        status_code = resp.status_code
        self.assertEqual(status_code, 200)
        resp = resp.json()
        self.assertTrue("token" in resp)

    def test_change_password(self):
        staff = StaffUtil.seeding(1, True)
        self.client.force_authenticate(user=staff.user)

        success_data = {
            "old_password": UserUtil.get_default_test_pwd(),
            "password": "Qwerty!@#456789",
            "password_confirm": "Qwerty!@#456789",
        }

        not_match_data = {
            "old_password": UserUtil.get_default_test_pwd(),
            "password": "Qwerty!@#456789",
            "password_confirm": "password",
        }

        wrong_old_pwd_data = {
            "old_password": "hello",
            "password": "Qwerty!@#456789",
            "password_confirm": "Qwerty!@#456789",
        }

        # Step 0 -> password not match
        resp = self.client.post(
            f"{self.base_url}change-password/",
            json.dumps(not_match_data),
            content_type="application/json",
        )

        status_code = resp.status_code
        self.assertEqual(status_code, 400)
        resp = resp.json()
        self.assertEqual(
            resp["password_confirm"], "Password and confirm password didn't match"
        )

        # Step 0.1 -> wrong old password
        resp = self.client.post(
            f"{self.base_url}change-password/",
            json.dumps(wrong_old_pwd_data),
            content_type="application/json",
        )

        status_code = resp.status_code
        self.assertEqual(status_code, 400)
        resp = resp.json()
        self.assertEqual(resp["old_password"], "Incorrect current password")

        # Step 1 -> change
        resp = self.client.post(
            f"{self.base_url}change-password/",
            json.dumps(success_data),
            content_type="application/json",
        )

        status_code = resp.status_code
        resp = resp.json()

        self.assertEqual(status_code, 200)
        self.assertEqual(resp, {})

        # Step 2 -> login
        resp = self.client.post(
            f"{self.base_url}login/",
            json.dumps(
                {"username": staff.user.username, "password": success_data["password"]}
            ),
            content_type="application/json",
        )

        status_code = resp.status_code
        self.assertEqual(status_code, 200)
        resp = resp.json()
        self.assertTrue("token" in resp)
