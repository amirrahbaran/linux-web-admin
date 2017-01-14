from django.test import TestCase, RequestFactory
from objects.models import Address
from .views import address_save


class SaveAddressTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_details(self):
        request = self.factory.post('/objects/address/save', {'Address': '192.168.200.1,172.16.30.1,30.30.30.1'})
        response = address_save(request)
        self.assertEqual(response.status_code, 200)
