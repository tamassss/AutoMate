from rest_framework import serializers
from .models import Felhasznalo

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Felhasznalo
        fields = ('email', 'password', 'nev')

    def create(self, validated_data):
        user = Felhasznalo.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            nev=validated_data.get('nev')
        )
        return user
