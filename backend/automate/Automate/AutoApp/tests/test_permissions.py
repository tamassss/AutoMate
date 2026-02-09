from django.test import TestCase
from rest_framework.test import APIClient

from AutoApp.models import User, Brand, CarModel, FuelType, Car, CarUser


class TestPermissions(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email="u@example.com", password="pass1234")
        self.other = User.objects.create_user(email="o@example.com", password="pass1234")

        self.brand = Brand.objects.create(name="Audi")
        self.model = CarModel.objects.create(brand=self.brand, name="A4")
        self.fuel_type = FuelType.objects.create(name="Diesel")

        self.car = Car.objects.create(
            license_plate="PERM-1",
            brand=self.brand,
            model=self.model,
            fuel_type=self.fuel_type,
            tank_capacity=50,
            horsepower=150,
            production_year=2016,
            odometer_km=100000
        )

        CarUser.objects.create(car=self.car, user=self.user, permission="driver")

    def test_access_allowed_for_assigned_driver(self):
        self.client.force_authenticate(self.user)
        resp = self.client.get(f"/api/routes/?car_id={self.car.car_id}")
        self.assertNotEqual(resp.status_code, 403)

    def test_access_denied_for_unassigned_user(self):
        self.client.force_authenticate(self.other)
        resp = self.client.get(f"/api/routes/?car_id={self.car.car_id}")
        self.assertEqual(resp.status_code, 403)
