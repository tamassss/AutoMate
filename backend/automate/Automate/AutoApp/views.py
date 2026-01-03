from django.db.models import Count, Sum, Avg, Max, Min, F
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import generics
from .serializers import RegisterSerializer
from .models import (
    Felhasznalo, Auto, AutoFelhasznalo, Marka, Modell, UzemanyagTipus,
    Tankolas, UtvonalHasznalat, Karbantartas, Benzinkut, Szerviz
)

# ---------------------------
# Register new user
# ---------------------------
class RegisterView(generics.CreateAPIView):
    queryset = Felhasznalo.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

# ---------------------------
# Helper function to get user from request
# ---------------------------
def get_current_user(request):
    return request.user


# ---------------------------
# WHO AM I
# ---------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def whoami(request):
    user = get_current_user(request)
    return Response({
        "felhasznalo_id": user.felhasznalo_id,
        "email": user.email,
        "nev": user.nev,
        "szerep": user.szerep,
        "is_active": user.is_active,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
        "last_login": user.last_login
    })


# ---------------------------
# User Statistics
# ---------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_statistics(request):
    user = get_current_user(request)

    total_cars = AutoFelhasznalo.objects.filter(felhasznalo=user, jogosultsag='tulaj').count()
    
    total_fuelings = Tankolas.objects.filter(felhasznalo=user).count()
    
    total_maintenance_cost = Karbantartas.objects.filter(felhasznalo=user).aggregate(total=Sum('koltseg'))['total'] or 0
    
    return Response({
        "total_cars": total_cars,
        "total_fuelings": total_fuelings,
        "total_maintenance_cost": float(total_maintenance_cost)
    })

# ---------------------------
# Car Statistics
# ---------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def car_statistics(request):
    user = get_current_user(request)
    
    cars = Auto.objects.filter(autofelhasznalo__felhasznalo=user)
    
    stats = cars.aggregate(
        total_cars=Count('auto_id'),
        avg_tank_capacity=Avg('tank_kapacitas'),
        max_power=Max('teljesitmeny'),
        min_power=Min('teljesitmeny')
    )
    
    fuel_distribution = cars.values('uzemanyag_tipus__megnevezes').annotate(count=Count('auto_id'))
    
    return Response({
        "overall": stats,
        "fuel_distribution": list(fuel_distribution)
    })

# ---------------------------
# Fueling Statistics
# ---------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fueling_statistics(request):
    user = get_current_user(request)
    
    fuelings = Tankolas.objects.filter(felhasznalo=user)
    
    total_liters = fuelings.aggregate(total=Sum('liter'))['total'] or 0
    avg_price = fuelings.aggregate(avg=Avg('ar_per_liter'))['avg'] or 0
    
    per_car = fuelings.values('auto__rendszam').annotate(
        total_liters=Sum('liter'),
        total_spent=Sum('liter' * 'ar_per_liter')
    )
    
    return Response({
        "total_liters": float(total_liters),
        "avg_price_per_liter": float(avg_price),
        "per_car": list(per_car)
    })

# ---------------------------
# Maintenance Statistics
# ---------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def maintenance_statistics(request):
    user = get_current_user(request)
    
    maints = Karbantartas.objects.filter(felhasznalo=user)
    
    total_cost = maints.aggregate(total=Sum('koltseg'))['total'] or 0
    avg_cost = maints.aggregate(avg=Avg('koltseg'))['avg'] or 0
    last_maintenance = maints.aggregate(last=Max('datum'))['last']
    
    return Response({
        "total_cost": float(total_cost),
        "average_cost": float(avg_cost),
        "last_maintenance": last_maintenance
    })

# ---------------------------
# Route Usage Statistics
# ---------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def route_statistics(request):
    user = get_current_user(request)
    routes = UtvonalHasznalat.objects.filter(felhasznalo=user)
    
    total_routes = routes.count()
    
    most_used = routes.values('utvonal__honnan_cim__varos', 'utvonal__hova_cim__varos') \
                      .annotate(count=Count('utvonal')).order_by('-count').first()
    
    return Response({
        "total_routes_used": total_routes,
        "most_used_route": most_used
    })

from AutoApp.services.route import get_latest_routes
from AutoApp.services.fueling import get_last_fuelings
from AutoApp.services.car import car_info
# ---------------------------
# Main Page Info combo
# ---------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mainpage(request):
    user = get_current_user(request)
    router = get_latest_routes(user)
    fueling = get_last_fuelings(user)
    car = car_info(user)
    res = [router,fueling,car]
    print(res)
    return Response(res)