from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

from django.utils.dateparse import parse_datetime
from django.db import transaction, IntegrityError
from django.db.models import Q

from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from AutoApp.api.utils import get_current_user, get_car_or_default, user_has_access_to_car
from AutoApp.services.cars import list_user_cars
from AutoApp.services.dashboard import get_dashboard_payload
from AutoApp.services.routes import list_route_cards
from AutoApp.services.fuelings import list_fuelings_grouped_by_month
from AutoApp.services.stats import get_general_statistics, get_summary_statistics
from AutoApp.services.service_logs import list_service_log
from AutoApp.services.gas_stations import list_gas_station_cards

from AutoApp.models import (
    CarUser,
    Brand, CarModel, FuelType, Car,
    GasStation, Fueling,
    ServiceCenter, Maintenance,
    Address, Route, RouteUsage,
)

User = get_user_model()

def _bad(msg, code=status.HTTP_400_BAD_REQUEST):
    return Response({"detail": msg}, status=code)

def _to_int(val, field):
    try:
        return int(val)
    except (TypeError, ValueError):
        raise ValueError(f"{field} must be an integer")

def _to_decimal_str(val, field):
    try:
        Decimal(str(val))
        return str(val)
    except Exception:
        raise ValueError(f"{field} must be a number")

def _parse_dt(val, field="date"):
    dt = parse_datetime(val) if isinstance(val, str) else None
    if dt is None:
        raise ValueError(f"Invalid {field} format. Use ISO-8601.")
    return dt


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_cars(request):
    user = get_current_user(request)
    return Response({"cars": list_user_cars(user)})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_dashboard(request):
    user = get_current_user(request)
    car_id = request.query_params.get("car_id")

    if car_id is not None:
        car_id = int(car_id)

        if not CarUser.objects.filter(user=user, car_id=car_id).exists():
            return Response({"detail": "Forbidden"}, status=403)

    return Response(get_dashboard_payload(user, car_id))


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_routes(request):
    user = get_current_user(request)
    car_id = request.query_params.get("car_id")
    car = get_car_or_default(user, int(car_id) if car_id else None)
    if not user_has_access_to_car(user, car):
        return Response({"detail": "Forbidden"}, status=403)
    limit = request.query_params.get("limit")
    limit = int(limit) if limit else 50
    return Response({"routes": list_route_cards(user, car, limit=limit)})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_fuelings(request):
    user = get_current_user(request)
    car_id = request.query_params.get("car_id")
    car = get_car_or_default(user, int(car_id) if car_id else None)
    if not user_has_access_to_car(user, car):
        return Response({"detail": "Forbidden"}, status=403)
    return Response({"fuelings_by_month": list_fuelings_grouped_by_month(user, car)})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_statistics_general(request):
    user = get_current_user(request)
    car_id = request.query_params.get("car_id")
    car = get_car_or_default(user, int(car_id) if car_id else None)
    if not user_has_access_to_car(user, car):
        return Response({"detail": "Forbidden"}, status=403)
    return Response(get_general_statistics(user, car))


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_statistics_summary(request):
    user = get_current_user(request)
    return Response({"summary": get_summary_statistics(user)})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_service_log(request):
    user = get_current_user(request)
    car_id = request.query_params.get("car_id")
    car = get_car_or_default(user, int(car_id) if car_id else None)
    if not user_has_access_to_car(user, car):
        return Response({"detail": "Forbidden"}, status=403)
    return Response({"service_log": list_service_log(user, car)})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_gas_stations(request):
    user = get_current_user(request)
    car_id = request.query_params.get("car_id")
    car = get_car_or_default(user, int(car_id) if car_id else None)
    if not user_has_access_to_car(user, car):
        return Response({"detail": "Forbidden"}, status=403)
    limit = request.query_params.get("limit")
    limit = int(limit) if limit else 50
    return Response({"gas_station_cards": list_gas_station_cards(user, car, limit=limit)})


# --------------------------
# AUTH (Register + Login)
# --------------------------

@api_view(["POST"])
@permission_classes([AllowAny])
def api_register(request):
    """
    Body: { "email": "...", "password": "...", "full_name": "..." }
    Returns: user + JWT tokens
    """
    email = (request.data.get("email") or "").strip().lower()
    password = request.data.get("password")
    full_name = request.data.get("full_name")

    if not email or not password:
        return _bad("Email and password are required")

    if User.objects.filter(email=email).exists():
        return _bad("Email already in use")

    try:
        user = User.objects.create_user(email=email, password=password, full_name=full_name)
    except Exception:
        return _bad("Could not create user")

    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "user": {"user_id": user.user_id, "email": user.email, "full_name": user.full_name, "role": user.role},
            "tokens": {"refresh": str(refresh), "access": str(refresh.access_token)},
        },
        status=201,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def api_login(request):
    email = (request.data.get("email") or "").strip().lower()
    password = request.data.get("password")

    if not email or not password:
        return _bad("Email and password are required")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"detail": "Invalid credentials"}, status=401)

    if not user.check_password(password):
        return Response({"detail": "Invalid credentials"}, status=401)

    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "user": {"user_id": user.user_id, "email": user.email, "full_name": user.full_name, "role": user.role},
            "tokens": {"refresh": str(refresh), "access": str(refresh.access_token)},
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_brands(request):
    brands = Brand.objects.all().order_by("name")
    return Response({"brands": [{"brand_id": b.brand_id, "name": b.name} for b in brands]})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_car_models(request):
    """
    Optional filter: ?brand_id=1
    """
    qs = CarModel.objects.select_related("brand").all().order_by("brand_id", "name")
    brand_id = request.query_params.get("brand_id")
    if brand_id:
        try:
            qs = qs.filter(brand_id=_to_int(brand_id, "brand_id"))
        except ValueError as e:
            return _bad(str(e))

    return Response(
        {
            "models": [
                {"model_id": m.model_id, "brand_id": m.brand_id, "name": m.name}
                for m in qs
            ]
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_fuel_types(request):
    qs = FuelType.objects.all().order_by("name")
    return Response({"fuel_types": [{"fuel_type_id": f.fuel_type_id, "name": f.name} for f in qs]})


# --------------------------
# Car add / update
# --------------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def api_car_create(request):
    """
    Body:
    {
      "license_plate": "ABC-123",
      "brand": "BMW",
      "model": "320d",
      "average_consumption": "6.80", (optional)
      "odometer_km": 120000 (optional)
    }
    """
    user = get_current_user(request)
    d = request.data

    required = ["license_plate", "brand", "model"]
    missing = [k for k in required if d.get(k) in (None, "")]
    if missing:
        return _bad(f"Missing fields: {', '.join(missing)}")

    try:
        brand_name = str(d.get("brand")).strip()
        model_name = str(d.get("model")).strip()
        odometer_km = _to_int(d.get("odometer_km"), "odometer_km") if d.get("odometer_km") not in (None, "") else None
        average_consumption = _to_decimal_str(d.get("average_consumption"), "average_consumption") if d.get("average_consumption") not in (None, "") else None
    except ValueError as e:
        return _bad(str(e))

    if not brand_name or not model_name:
        return _bad("brand and model must be non-empty strings")

    brand, _ = Brand.objects.get_or_create(name=brand_name)
    model, _ = CarModel.objects.get_or_create(brand=brand, name=model_name)

    try:
        with transaction.atomic():
            car = Car.objects.create(
                license_plate=d["license_plate"],
                brand=brand,
                model=model,
                odometer_km=odometer_km,
                average_consumption=average_consumption,
            )
            CarUser.objects.create(car=car, user=user, permission="owner")
    except IntegrityError:
        return _bad("Could not create car (integrity error). Check unique license plate and ids.")

    return Response({"car_id": car.car_id}, status=201)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def api_car_update(request, car_id: int):
    """
    PATCH /cars/{car_id}/
    """
    user = get_current_user(request)
    car = get_car_or_default(user, int(car_id))
    if not user_has_access_to_car(user, car):
        return Response({"detail": "Forbidden"}, status=403)

    d = request.data
    try:
        if "brand" in d and d["brand"] in (None, ""):
            return _bad("brand cannot be empty")
        if "model" in d and d["model"] in (None, ""):
            return _bad("model cannot be empty")
    except ValueError as e:
        return _bad(str(e))

    try:
        if "license_plate" in d:
            car.license_plate = d["license_plate"] if d["license_plate"] != "" else None

        if "brand" in d or "model" in d:
            brand_name = str(d.get("brand", car.brand.name)).strip()
            model_name = str(d.get("model", car.model.name)).strip()
            if not brand_name or not model_name:
                return _bad("brand and model must be non-empty strings")
            brand, _ = Brand.objects.get_or_create(name=brand_name)
            model, _ = CarModel.objects.get_or_create(brand=brand, name=model_name)
            car.brand = brand
            car.model = model

        if "average_consumption" in d:
            car.average_consumption = _to_decimal_str(d["average_consumption"], "average_consumption") if d["average_consumption"] not in (None, "") else None

        if "odometer_km" in d:
            car.odometer_km = _to_int(d["odometer_km"], "odometer_km") if d["odometer_km"] not in (None, "") else None
    except ValueError as e:
        return _bad(str(e))

    try:
        car.save()
    except IntegrityError:
        return _bad("Could not update car (integrity error). Check unique license plate and ids.")

    return Response({"ok": True})


# --------------------------
# Gas station create
# --------------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def api_gas_station_create(request):
    """
    Body:
    { "name": "...", "city": "...", "postal_code": "...", "street": "...", "house_number": "..." }
    """
    d = request.data

    try:
        gas_station = GasStation.objects.create(
            name=(d.get("name") or None),
            city=(d.get("city") or None),
            postal_code=(d.get("postal_code") or None),
            street=(d.get("street") or None),
            house_number=(d.get("house_number") or None),
        )
    except IntegrityError:
        return _bad("Could not create gas station (integrity error).")

    return Response({"gas_station_id": gas_station.gas_station_id}, status=201)


# --------------------------
# Fueling create
# --------------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def api_fueling_create(request):
    """
    Body:
    {
      "car_id": 1,
      "gas_station_id": 3,
      "fuel_type_id": 2, (optional)
      "date": "2026-02-05T10:30:00Z",
      "liters": "42.50",
      "price_per_liter": "615.00",
      "supplier": "MOL" (optional),
      "odometer_km": 121000
    }
    """
    user = get_current_user(request)
    d = request.data

    required = ["car_id", "gas_station_id", "date", "liters", "price_per_liter", "odometer_km"]
    missing = [k for k in required if d.get(k) in (None, "")]
    if missing:
        return _bad(f"Missing fields: {', '.join(missing)}")

    try:
        car_id = _to_int(d.get("car_id"), "car_id")
        gas_station_id = _to_int(d.get("gas_station_id"), "gas_station_id")
        fuel_type_id = _to_int(d.get("fuel_type_id"), "fuel_type_id") if d.get("fuel_type_id") not in (None, "") else None
        odometer_km = _to_int(d.get("odometer_km"), "odometer_km")
        dt = _parse_dt(d.get("date"), "date")
        liters = _to_decimal_str(d.get("liters"), "liters")
        price_per_liter = _to_decimal_str(d.get("price_per_liter"), "price_per_liter")
    except ValueError as e:
        return _bad(str(e))

    car = get_car_or_default(user, car_id)
    if not user_has_access_to_car(user, car):
        return Response({"detail": "Forbidden"}, status=403)

    if not GasStation.objects.filter(gas_station_id=gas_station_id).exists():
        return _bad("Invalid gas_station_id")
    if fuel_type_id is not None and not FuelType.objects.filter(fuel_type_id=fuel_type_id).exists():
        return _bad("Invalid fuel_type_id")

    try:
        fueling = Fueling.objects.create(
            user=user,
            car=car,
            gas_station_id=gas_station_id,
            fuel_type_id=fuel_type_id,
            date=dt,
            liters=liters,
            price_per_liter=price_per_liter,
            supplier=d.get("supplier") or None,
            odometer_km=odometer_km,
        )
    except IntegrityError:
        return _bad("Could not create fueling (integrity error). Check ids and values.")

    return Response({"fueling_id": fueling.fueling_id}, status=201)


# --------------------------
# Service center + maintenance create
# --------------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def api_service_center_create(request):
    """
    Body: { "name": "...", "city": "...", "postal_code": "...", "street": "...", "house_number": "..." }
    """
    d = request.data
    if not d.get("name"):
        return _bad("name is required")

    try:
        sc = ServiceCenter.objects.create(
            name=d["name"],
            city=d.get("city") or None,
            postal_code=d.get("postal_code") or None,
            street=d.get("street") or None,
            house_number=d.get("house_number") or None,
        )
    except IntegrityError:
        return _bad("Could not create service center (integrity error).")

    return Response({"service_center_id": sc.service_center_id}, status=201)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def api_maintenance_create(request):
    """
    Body:
    {
      "car_id": 1,
      "service_center_id": 2,
      "date": "2026-02-01T09:00:00Z",
      "part_name": "...", (optional)
      "cost": "35000.00", (optional)
      "description": "...", (optional)
      "reminder": "...", (optional)
    }
    """
    user = get_current_user(request)
    d = request.data

    required = ["car_id", "service_center_id", "date"]
    missing = [k for k in required if d.get(k) in (None, "")]
    if missing:
        return _bad(f"Missing fields: {', '.join(missing)}")

    try:
        car_id = _to_int(d.get("car_id"), "car_id")
        service_center_id = _to_int(d.get("service_center_id"), "service_center_id")
        dt = _parse_dt(d.get("date"), "date")
        cost = _to_decimal_str(d.get("cost"), "cost") if d.get("cost") not in (None, "") else None
    except ValueError as e:
        return _bad(str(e))

    car = get_car_or_default(user, car_id)
    if not user_has_access_to_car(user, car):
        return Response({"detail": "Forbidden"}, status=403)

    if not ServiceCenter.objects.filter(service_center_id=service_center_id).exists():
        return _bad("Invalid service_center_id")

    try:
        m = Maintenance.objects.create(
            car=car,
            service_center_id=service_center_id,
            user=user,
            date=dt,
            description=d.get("description") or None,
            cost=cost,
            reminder=d.get("reminder") or None,
            part_name=d.get("part_name") or None,
        )
    except IntegrityError:
        return _bad("Could not create maintenance (integrity error). Check ids and values.")

    return Response({"maintenance_id": m.maintenance_id}, status=201)


# --------------------------
# Address + Route + RouteUsage create
# --------------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def api_address_create(request):
    """
    Body: { "country":"", "city":"", "postal_code":"", "street":"", "house_number":"" }
    """
    d = request.data
    if not d.get("city"):
        return _bad("city is required")

    try:
        a = Address.objects.create(
            country=d.get("country") or None,
            city=d["city"],
            postal_code=d.get("postal_code") or None,
            street=d.get("street") or None,
            house_number=d.get("house_number") or None,
        )
    except IntegrityError:
        return _bad("Could not create address (integrity error).")

    return Response({"address_id": a.address_id}, status=201)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def api_route_create(request):
    """
    Body: { "from_address_id": 1, "to_address_id": 2 }
    """
    d = request.data
    if not d.get("from_address_id") or not d.get("to_address_id"):
        return _bad("from_address_id and to_address_id are required")

    try:
        from_address_id = _to_int(d.get("from_address_id"), "from_address_id")
        to_address_id = _to_int(d.get("to_address_id"), "to_address_id")
    except ValueError as e:
        return _bad(str(e))

    if not Address.objects.filter(address_id=from_address_id).exists():
        return _bad("Invalid from_address_id")
    if not Address.objects.filter(address_id=to_address_id).exists():
        return _bad("Invalid to_address_id")

    try:
        r = Route.objects.create(from_address_id=from_address_id, to_address_id=to_address_id)
    except IntegrityError:
        return _bad("Could not create route (integrity error).")

    return Response({"route_id": r.route_id}, status=201)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def api_route_usage_create(request):
    """
    Body:
    {
      "car_id": 1,
      "route_id": 5,
      "date": "2026-02-05T12:00:00Z",
      "distance_km": "15.20" (optional),
      "departure_time": 930 (optional),
      "arrival_time": 1015 (optional)
    }
    """
    user = get_current_user(request)
    d = request.data

    required = ["car_id", "route_id", "date"]
    missing = [k for k in required if d.get(k) in (None, "")]
    if missing:
        return _bad(f"Missing fields: {', '.join(missing)}")

    try:
        car_id = _to_int(d.get("car_id"), "car_id")
        route_id = _to_int(d.get("route_id"), "route_id")
        dt = _parse_dt(d.get("date"), "date")
        departure_time = _to_int(d.get("departure_time"), "departure_time") if d.get("departure_time") not in (None, "") else None
        arrival_time = _to_int(d.get("arrival_time"), "arrival_time") if d.get("arrival_time") not in (None, "") else None
        distance_km = _to_decimal_str(d.get("distance_km"), "distance_km") if d.get("distance_km") not in (None, "") else None
    except ValueError as e:
        return _bad(str(e))

    car = get_car_or_default(user, car_id)
    if not user_has_access_to_car(user, car):
        return Response({"detail": "Forbidden"}, status=403)

    if not Route.objects.filter(route_id=route_id).exists():
        return _bad("Invalid route_id")

    create_kwargs = dict(
        car=car,
        user=user,
        route_id=route_id,
        date=dt,
        departure_time=departure_time,
        arrival_time=arrival_time,
        distance_km=distance_km,
    )

    if "title" in d:
        create_kwargs["title"] = d.get("title")

    try:
        ru = RouteUsage.objects.create(**create_kwargs)
    except TypeError:
        return _bad("RouteUsage does not support one of the provided fields (e.g., title).")
    except IntegrityError:
        return _bad("Could not create route usage (integrity error).")

    return Response({"route_usage_id": ru.route_usage_id}, status=201)


def _is_owner(user, car: Car) -> bool:
    return CarUser.objects.filter(user=user, car=car, permission="owner").exists()


# ----------------------------
# DELETE: Car (owner only)
# ----------------------------
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def api_car_delete(request, car_id: int):
    user = get_current_user(request)
    car = get_car_or_default(user, int(car_id))

    if not user_has_access_to_car(user, car):
        return Response({"detail": "Forbidden"}, status=403)

    if not _is_owner(user, car):
        return Response({"detail": "Only the owner can delete a car"}, status=403)

    if Fueling.objects.filter(car=car).exists():
        return Response({"detail": "Cannot delete car: it has fuelings"}, status=409)
    if Maintenance.objects.filter(car=car).exists():
        return Response({"detail": "Cannot delete car: it has maintenance logs"}, status=409)
    if RouteUsage.objects.filter(car=car).exists():
        return Response({"detail": "Cannot delete car: it has route usage entries"}, status=409)

    CarUser.objects.filter(car=car).delete()
    car.delete()
    return Response(status=204)


# ----------------------------
# DELETE: Fueling
# ----------------------------
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def api_fueling_delete(request, fueling_id: int):
    user = get_current_user(request)

    try:
        fueling = Fueling.objects.select_related("car").get(fueling_id=fueling_id)
    except Fueling.DoesNotExist:
        return Response({"detail": "Not found"}, status=404)

    if not user_has_access_to_car(user, fueling.car):
        return Response({"detail": "Forbidden"}, status=403)

    fueling.delete()
    return Response(status=204)


# ----------------------------
# DELETE: Maintenance
# ----------------------------
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def api_maintenance_delete(request, maintenance_id: int):
    user = get_current_user(request)

    try:
        m = Maintenance.objects.select_related("car").get(maintenance_id=maintenance_id)
    except Maintenance.DoesNotExist:
        return Response({"detail": "Not found"}, status=404)

    if not user_has_access_to_car(user, m.car):
        return Response({"detail": "Forbidden"}, status=403)

    m.delete()
    return Response(status=204)


# ----------------------------
# DELETE: RouteUsage (event)
# ----------------------------
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def api_route_usage_delete(request, route_usage_id: int):
    user = get_current_user(request)

    try:
        ru = RouteUsage.objects.select_related("car").get(route_usage_id=route_usage_id)
    except RouteUsage.DoesNotExist:
        return Response({"detail": "Not found"}, status=404)

    if not user_has_access_to_car(user, ru.car):
        return Response({"detail": "Forbidden"}, status=403)

    ru.delete()
    return Response(status=204)


# ----------------------------
# DELETE: GasStation (only if unused)
# ----------------------------
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def api_gas_station_delete(request, gas_station_id: int):
    try:
        gs = GasStation.objects.get(gas_station_id=gas_station_id)
    except GasStation.DoesNotExist:
        return Response({"detail": "Not found"}, status=404)

    if Fueling.objects.filter(gas_station=gs).exists():
        return Response({"detail": "Cannot delete gas station: it is used by fuelings"}, status=409)

    gs.delete()
    return Response(status=204)


# ----------------------------
# DELETE: ServiceCenter (only if unused)
# ----------------------------
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def api_service_center_delete(request, service_center_id: int):
    try:
        sc = ServiceCenter.objects.get(service_center_id=service_center_id)
    except ServiceCenter.DoesNotExist:
        return Response({"detail": "Not found"}, status=404)

    if Maintenance.objects.filter(service_center=sc).exists():
        return Response({"detail": "Cannot delete service center: it is used by maintenance logs"}, status=409)

    sc.delete()
    return Response(status=204)


# ----------------------------
# DELETE: Address (only if unused by routes)
# ----------------------------
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def api_address_delete(request, address_id: int):
    try:
        a = Address.objects.get(address_id=address_id)
    except Address.DoesNotExist:
        return Response({"detail": "Not found"}, status=404)

    if Route.objects.filter(Q(from_address=a) | Q(to_address=a)).exists():
        return Response({"detail": "Cannot delete address: it is used by a route"}, status=409)

    a.delete()
    return Response(status=204)


# ----------------------------
# DELETE: Route (only if unused by route usage)
# ----------------------------
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def api_route_delete(request, route_id: int):
    try:
        r = Route.objects.get(route_id=route_id)
    except Route.DoesNotExist:
        return Response({"detail": "Not found"}, status=404)

    if RouteUsage.objects.filter(route=r).exists():
        return Response({"detail": "Cannot delete route: it is used by route usage"}, status=409)

    r.delete()
    return Response(status=204)
