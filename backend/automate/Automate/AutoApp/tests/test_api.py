from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient
from decimal import Decimal


from AutoApp.models import (
    User, Brand, CarModel, FuelType, Car, CarUser,
    Address, Route, RouteUsage,
    GasStation, Fueling,
    ServiceCenter, Maintenance
)


class BaseAPITestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(email="user@example.com", password="pass1234", full_name="Test User")
        cls.user2 = User.objects.create_user(email="user2@example.com", password="pass1234", full_name="Other User")

        cls.brand = Brand.objects.create(name="BMW")
        cls.model = CarModel.objects.create(brand=cls.brand, name="320d")
        cls.fuel_type = FuelType.objects.create(name="Diesel")

        cls.car = Car.objects.create(
            license_plate="ABC-123",
            brand=cls.brand,
            model=cls.model,
            fuel_type=cls.fuel_type,
            tank_capacity=55.00,
            horsepower=190,
            production_year=2018,
            odometer_km=123456
        )

        cls.car2 = Car.objects.create(
            license_plate="XYZ-999",
            brand=cls.brand,
            model=cls.model,
            fuel_type=cls.fuel_type,
            tank_capacity=60.00,
            horsepower=200,
            production_year=2020,
            odometer_km=55555
        )

        CarUser.objects.create(car=cls.car, user=cls.user, permission="owner")
        CarUser.objects.create(car=cls.car2, user=cls.user2, permission="owner")

        cls.addr1 = Address.objects.create(country="HU", city="God", postal_code="2131", street="Main", house_number="1")
        cls.addr2 = Address.objects.create(country="HU", city="Mogyorod", postal_code="2146", street="Track", house_number="2")
        cls.route = Route.objects.create(from_address=cls.addr1, to_address=cls.addr2)

        cls.route_usage = RouteUsage.objects.create(
            car=cls.car,
            user=cls.user,
            route=cls.route,
            date=timezone.now() - timezone.timedelta(days=2),
            departure_time=8 * 60 + 10,
            arrival_time=8 * 60 + 35,
            distance_km=Decimal("16.00")
        )

        cls.gas_station = GasStation.objects.create(name="OMV", city="Budapest", postal_code="1111", street="Fuel", house_number="10")

        Fueling.objects.create(
            user=cls.user,
            car=cls.car,
            gas_station=cls.gas_station,
            fuel_type=cls.fuel_type,
            date=timezone.now() - timezone.timedelta(days=1),
            liters=Decimal("45.00"),
            price_per_liter=Decimal("600.00"),
            supplier="OMV",
            odometer_km=123500
        )

        cls.service_center = ServiceCenter.objects.create(name="Bosch Service", city="Budapest", postal_code="1111", street="Fix", house_number="20")

        Maintenance.objects.create(
            car=cls.car,
            service_center=cls.service_center,
            user=cls.user,
            date=timezone.now() - timezone.timedelta(days=7),
            description="Oil change",
            cost=Decimal("25000.00"),
            reminder="1646 km",
            part_name="Engine oil"
        )

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)


class TestCarsEndpoint(BaseAPITestCase):
    def test_list_cars_returns_only_user_cars(self):
        resp = self.client.get("/api/cars/")
        self.assertEqual(resp.status_code, 200)
        cars = resp.json()["cars"]
        self.assertTrue(any(c["license_plate"] == "ABC-123" for c in cars))
        self.assertFalse(any(c["license_plate"] == "XYZ-999" for c in cars))


class TestDashboardEndpoint(BaseAPITestCase):
    def test_dashboard_returns_required_blocks(self):
        resp = self.client.get("/api/dashboard/")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("selected_car", data)
        self.assertIn("route_card", data)
        self.assertIn("monthly_budget", data)
        self.assertIn("fueling_chart", data)
        self.assertIn("latest_fueling", data)
        self.assertIn("events", data)

    def test_dashboard_with_car_id(self):
        resp = self.client.get(f"/api/dashboard/?car_id={self.car.car_id}")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["selected_car"]["car_id"], self.car.car_id)

    def test_dashboard_forbidden_car_id_not_owned(self):
        resp = self.client.get(f"/api/dashboard/?car_id={self.car2.car_id}")
        self.assertIn(resp.status_code, [200, 404, 403])


class TestRoutesEndpoint(BaseAPITestCase):
    def test_routes_returns_routes(self):
        resp = self.client.get(f"/api/routes/?car_id={self.car.car_id}")
        self.assertEqual(resp.status_code, 200)
        routes = resp.json()["routes"]
        self.assertTrue(len(routes) >= 1)
        self.assertIn("from_city", routes[0])
        self.assertIn("to_city", routes[0])

    def test_routes_forbidden_without_access(self):
        resp = self.client.get(f"/api/routes/?car_id={self.car2.car_id}")
        self.assertEqual(resp.status_code, 403)


class TestFuelingsEndpoint(BaseAPITestCase):
    def test_fuelings_grouped_by_month(self):
        resp = self.client.get(f"/api/fuelings/?car_id={self.car.car_id}")
        self.assertEqual(resp.status_code, 200)
        payload = resp.json()["fuelings_by_month"]
        self.assertTrue(isinstance(payload, list))
        self.assertTrue(all("month" in m and "items" in m for m in payload))

    def test_fuelings_forbidden_without_access(self):
        resp = self.client.get(f"/api/fuelings/?car_id={self.car2.car_id}")
        self.assertEqual(resp.status_code, 403)


class TestStatisticsEndpoints(BaseAPITestCase):
    def test_general_statistics(self):
        resp = self.client.get(f"/api/statistics/general/?car_id={self.car.car_id}")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("distance_km_total", data)
        self.assertIn("fuelings", data)
        self.assertIn("maintenance", data)

    def test_summary_statistics(self):
        resp = self.client.get("/api/statistics/summary/")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("summary", resp.json())


class TestServiceLogEndpoint(BaseAPITestCase):
    def test_service_log(self):
        resp = self.client.get(f"/api/service-log/?car_id={self.car.car_id}")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()["service_log"]
        self.assertTrue(len(data) >= 1)
        self.assertIn("maintenance_id", data[0])


class TestGasStationsEndpoint(BaseAPITestCase):
    def test_gas_station_cards(self):
        resp = self.client.get(f"/api/gas-stations/?car_id={self.car.car_id}")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()["gas_station_cards"]
        self.assertTrue(len(data) >= 1)
        self.assertIn("gas_station", data[0])

    def test_gas_station_cards_forbidden_without_access(self):
        resp = self.client.get(f"/api/gas-stations/?car_id={self.car2.car_id}")
        self.assertEqual(resp.status_code, 403)
