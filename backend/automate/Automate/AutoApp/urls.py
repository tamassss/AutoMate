from django.urls import path
from .views import whoami,user_statistics, car_statistics, fueling_statistics, maintenance_statistics, route_statistics, mainpage

urlpatterns = [
    path('whoami',whoami),
    path('stats/user/', user_statistics),
    path('stats/car/', car_statistics),
    path('stats/fueling/', fueling_statistics),
    path('stats/maintenance/', maintenance_statistics),
    path('stats/routes/', route_statistics),
    path('stats/mainpage',mainpage)
]
