from django.urls import path
from .views import getUserStats, getAllUserData

urlpatterns = [
    path("userdata/<int:uid>/",getUserStats),
    path("alluserdata/<int:uid>/",getAllUserData)
]