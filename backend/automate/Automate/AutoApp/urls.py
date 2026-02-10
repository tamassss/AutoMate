from django.urls import path

from AutoApp.views import (
    api_cars,
    api_dashboard,
    api_routes,
    api_fuelings,
    api_statistics_general,
    api_statistics_summary,
    api_service_log,
    api_gas_stations,

    api_brands,
    api_car_models,
    api_fuel_types,

    api_car_create,
    api_car_update,
    api_gas_station_create,
    api_fueling_create,
    api_service_center_create,
    api_maintenance_create,
    api_address_create,
    api_route_create,
    api_route_usage_create,
    
    api_car_delete,
    api_fueling_delete,
    api_maintenance_delete,
    api_route_usage_delete,
    api_gas_station_delete,
    api_service_center_delete,
    api_address_delete,
    api_route_delete,
)

from AutoApp.auth_views import RegisterView
from AutoApp.views import api_login


urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),

    path("auth/login/", api_login, name="login"),

    path("cars/", api_cars, name="api_cars"),
    path("dashboard/", api_dashboard, name="api_dashboard"),
    path("routes/", api_routes, name="api_routes"),
    path("fuelings/", api_fuelings, name="api_fuelings"),
    path("statistics/general/", api_statistics_general, name="api_statistics_general"),
    path("statistics/summary/", api_statistics_summary, name="api_statistics_summary"),
    path("service-log/", api_service_log, name="api_service_log"),
    path("gas-stations/", api_gas_stations, name="api_gas_stations"),

    path("lookups/brands/", api_brands, name="api_brands"),
    path("lookups/models/", api_car_models, name="api_car_models"),
    path("lookups/fuel-types/", api_fuel_types, name="api_fuel_types"),

    path("cars/create/", api_car_create, name="api_car_create"),
    path("cars/<int:car_id>/", api_car_update, name="api_car_update"),


    path("gas-stations/create/", api_gas_station_create, name="api_gas_station_create"),
    path("fuelings/create/", api_fueling_create, name="api_fueling_create"),

    path("service-centers/create/", api_service_center_create, name="api_service_center_create"),
    path("maintenance/create/", api_maintenance_create, name="api_maintenance_create"),

    path("addresses/create/", api_address_create, name="api_address_create"),
    path("routes/create/", api_route_create, name="api_route_create"),
    path("route-usage/create/", api_route_usage_create, name="api_route_usage_create"),
    
    
    path("cars/<int:car_id>/delete/", api_car_delete, name="api_car_delete"),
    path("fuelings/<int:fueling_id>/delete/", api_fueling_delete, name="api_fueling_delete"),
    path("maintenance/<int:maintenance_id>/delete/", api_maintenance_delete, name="api_maintenance_delete"),
    path("route-usage/<int:route_usage_id>/delete/", api_route_usage_delete, name="api_route_usage_delete"),
    path("gas-stations/<int:gas_station_id>/delete/", api_gas_station_delete, name="api_gas_station_delete"),
    path("service-centers/<int:service_center_id>/delete/", api_service_center_delete, name="api_service_center_delete"),
    path("addresses/<int:address_id>/delete/", api_address_delete, name="api_address_delete"),
    path("routes/<int:route_id>/delete/", api_route_delete, name="api_route_delete"),
]
