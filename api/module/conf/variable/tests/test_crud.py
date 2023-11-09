import json
from rest_framework.test import APIClient
from django.test import TestCase
from module.account.staff.helper.util import StaffUtil
from ..models import Variable
from ..helper.util import VariableUtil

# Create your tests here.


class VariableTestCase(TestCase):
    def setUp(self):
        self.base_url = "/api/v1/configuration/variable/"
        self.base_url_params = "/api/v1/configuration/variable/{}"

        staff = StaffUtil.seeding(1, True)
        staff.user.is_staff = True
        staff.user.save()

        self.client = APIClient()
        self.client.force_authenticate(user=staff.user)

        self.items = VariableUtil.seeding(3)

    def test_list(self):
        response = self.client.get(self.base_url)
        self.assertEqual(response.status_code, 200)
        response = response.json()
        self.assertEqual(response["count"], 3)

    def test_detail(self):
        # Item not exist
        response = self.client.get(self.base_url_params.format(0))
        self.assertEqual(response.status_code, 404)

        # Item exist
        response = self.client.get(self.base_url_params.format(self.items[0].pk))
        self.assertEqual(response.status_code, 200)

    def test_create(self):
        item3 = VariableUtil.seeding(3, True, False)
        item4 = VariableUtil.seeding(4, True, False)

        # Add duplicate
        response = self.client.post(
            self.base_url, json.dumps(item3), content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

        # Add success
        response = self.client.post(
            self.base_url, json.dumps(item4), content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Variable.objects.count(), 4)

    def test_edit(self):
        item3 = VariableUtil.seeding(3, True, False)

        # Update not exist
        response = self.client.put(
            self.base_url_params.format(0),
            json.dumps(item3),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 404)

        # Update duplicate
        response = self.client.put(
            self.base_url_params.format(self.items[0].pk),
            json.dumps(item3),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)

        # Update success
        response = self.client.put(
            self.base_url_params.format(self.items[2].pk),
            json.dumps(item3),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)

    def test_delete(self):
        # Remove not exist
        response = self.client.delete(self.base_url_params.format(0))
        self.assertEqual(response.status_code, 404)
        self.assertEqual(Variable.objects.count(), 3)

        # Remove single success
        response = self.client.delete(self.base_url_params.format(self.items[0].pk))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Variable.objects.count(), 2)

        # Remove list success
        ids = ",".join([str(self.items[1].pk), str(self.items[2].pk)])
        response = self.client.delete(self.base_url + "?ids={}".format(ids))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Variable.objects.count(), 0)
