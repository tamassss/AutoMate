from AutoApp.models import Auto

def car_info(user):
    cars = Auto.objects.filter(
            autofelhasznalo__felhasznalo=user,
            autofelhasznalo__jogosultsag='tulaj'
        ).select_related(
            'marka',
            'modell',
            'uzemanyag_tipus',
        )
    try: 
        car = cars[0]
        car_info = {
            'nev':car.marka.nev,
            'modell':car.modell.modellnev,
            'uzemanyag':car.uzemanyag_tipus.megnevezes,
            'evjarat':car.gyartasi_ev,
            'orallas':car.km_ora_allas,
            'teljesitmeny':car.teljesitmeny
        }
        return car_info
    except IndexError:
        return "Car not found"