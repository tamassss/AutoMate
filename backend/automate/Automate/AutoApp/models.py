from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# ---------------------------
# Custom User
# ---------------------------
class FelhasznaloManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

class Felhasznalo(AbstractBaseUser, PermissionsMixin):
    felhasznalo_id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    nev = models.CharField(max_length=255, null=True, blank=True)
    szerep = models.CharField(max_length=10, choices=[('admin','admin'),('user','user')], default='user')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = FelhasznaloManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'felhasznalo'
        managed = False

# ---------------------------
# Marka
# ---------------------------
class Marka(models.Model):
    marka_id = models.AutoField(primary_key=True)
    nev = models.CharField(max_length=255, unique=True)

    class Meta:
        db_table = 'marka'
        managed = False

# ---------------------------
# Modell
# ---------------------------
class Modell(models.Model):
    modell_id = models.AutoField(primary_key=True)
    marka = models.ForeignKey(Marka, on_delete=models.CASCADE)
    modellnev = models.CharField(max_length=255)

    class Meta:
        db_table = 'modell'
        managed = False

# ---------------------------
# UzemanyagTipus
# ---------------------------
class UzemanyagTipus(models.Model):
    uzemanyag_tipus_id = models.AutoField(primary_key=True)
    megnevezes = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'uzemanyag_tipus'
        managed = False

# ---------------------------
# Auto
# ---------------------------
class Auto(models.Model):
    auto_id = models.AutoField(primary_key=True)
    rendszam = models.CharField(max_length=20, unique=True)
    marka = models.ForeignKey(Marka, on_delete=models.CASCADE)
    modell = models.ForeignKey(Modell, on_delete=models.CASCADE)
    uzemanyag_tipus = models.ForeignKey(UzemanyagTipus, on_delete=models.CASCADE)
    tank_kapacitas = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    teljesitmeny = models.IntegerField(null=True, blank=True)
    gyartasi_ev = models.IntegerField(null=True, blank=True)
    km_ora_allas = models.IntegerField()

    class Meta:
        db_table = 'auto'
        managed = False

# ---------------------------
# Auto-Felhasznalo
# ---------------------------
class AutoFelhasznalo(models.Model):
    auto = models.ForeignKey(Auto, on_delete=models.CASCADE)
    felhasznalo = models.ForeignKey(Felhasznalo, on_delete=models.CASCADE)
    jogosultsag = models.CharField(max_length=10, choices=[('tulaj','tulaj'), ('hasznalo','hasznalo')])

    class Meta:
        db_table = 'auto_felhasznalo'
        managed = False
        unique_together = ('auto', 'felhasznalo')

# ---------------------------
# Cim
# ---------------------------
class Cim(models.Model):
    cim_id = models.AutoField(primary_key=True)
    orszag = models.CharField(max_length=100, null=True, blank=True)
    varos = models.CharField(max_length=100)
    iranyitoszam = models.CharField(max_length=10, null=True, blank=True)
    utca = models.CharField(max_length=255, null=True, blank=True)
    hazszam = models.CharField(max_length=10, null=True, blank=True)

    class Meta:
        db_table = 'cim'
        managed = False

# ---------------------------
# Utvonal
# ---------------------------
class Utvonal(models.Model):
    utvonal_id = models.AutoField(primary_key=True)
    honnan_cim = models.ForeignKey(Cim, related_name='honnan_utvonal', on_delete=models.CASCADE)
    hova_cim = models.ForeignKey(Cim, related_name='hova_utvonal', on_delete=models.CASCADE)

    class Meta:
        db_table = 'utvonal'
        managed = False

# ---------------------------
# UtvonalHasznalat
# ---------------------------
class UtvonalHasznalat(models.Model):
    utvonal_hasznalat_id = models.AutoField(primary_key=True)
    auto = models.ForeignKey(Auto, on_delete=models.CASCADE)
    felhasznalo = models.ForeignKey(Felhasznalo, on_delete=models.CASCADE)
    utvonal = models.ForeignKey(Utvonal, on_delete=models.CASCADE)
    datum = models.DateTimeField()
    indulas = models.IntegerField(null=True, blank=True)
    erkezes = models.IntegerField(null=True, blank=True)
    hossz = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    
    class Meta:
        db_table = 'utvonal_hasznalat'
        managed = False

# ---------------------------
# Benzinkut
# ---------------------------
class Benzinkut(models.Model):
    benzinkut_id = models.AutoField(primary_key=True)
    nev = models.CharField(max_length=255, null=True, blank=True)
    varos = models.CharField(max_length=100, null=True, blank=True)
    iranyitoszam = models.CharField(max_length=10, null=True, blank=True)
    utca = models.CharField(max_length=255, null=True, blank=True)
    hazszam = models.CharField(max_length=10, null=True, blank=True)

    class Meta:
        db_table = 'benzinkut'
        managed = False

# ---------------------------
# Tankolas
# ---------------------------
class Tankolas(models.Model):
    tankolas_id = models.AutoField(primary_key=True)
    felhasznalo = models.ForeignKey(Felhasznalo, on_delete=models.CASCADE)
    auto = models.ForeignKey(Auto, on_delete=models.CASCADE)
    benzinkut = models.ForeignKey(Benzinkut, on_delete=models.CASCADE)
    uzemanyag = models.ForeignKey(UzemanyagTipus, on_delete=models.CASCADE)
    datum = models.DateTimeField()
    liter = models.DecimalField(max_digits=7, decimal_places=2)
    ar_per_liter = models.DecimalField(max_digits=7, decimal_places=2)
    forgalmazo = models.CharField(max_length=100, null=True, blank=True)
    km_allas = models.IntegerField()

    class Meta:
        db_table = 'tankolas'
        managed = False

# ---------------------------
# Szerviz
# ---------------------------
class Szerviz(models.Model):
    szerviz_id = models.AutoField(primary_key=True)
    nev = models.CharField(max_length=255)
    varos = models.CharField(max_length=100, null=True, blank=True)
    iranyitoszam = models.CharField(max_length=10, null=True, blank=True)
    utca = models.CharField(max_length=255, null=True, blank=True)
    hazszam = models.CharField(max_length=10, null=True, blank=True)

    class Meta:
        db_table = 'szerviz'
        managed = False

# ---------------------------
# Karbantartas
# ---------------------------
class Karbantartas(models.Model):
    karbantartas_id = models.AutoField(primary_key=True)
    auto = models.ForeignKey(Auto, on_delete=models.CASCADE)
    szerviz = models.ForeignKey(Szerviz, on_delete=models.CASCADE)
    felhasznalo = models.ForeignKey(Felhasznalo, on_delete=models.CASCADE)
    datum = models.DateTimeField()
    leiras = models.TextField(null=True, blank=True)
    koltseg = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = 'karbantartas'
        managed = False
