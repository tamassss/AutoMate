from AutoApp.models import Tankolas
def get_last_fuelings(user_id, limit=2):
    latest_fuels = (
        Tankolas.objects
        .filter(felhasznalo_id=user_id)
        .order_by('-datum')[:limit]
    )

    formatted_res = []
    for route_instance in latest_fuels:
        formatted_res.append({
            "datum": route_instance.datum.strftime("%Y-%m-%d"),
            "liter": route_instance.liter,
            "ar_per_liter": route_instance.ar_per_liter,
            "km_ora_allas": route_instance.km_allas,
            "helyiseg": route_instance.benzinkut.varos,
            "forgalmazo": route_instance.forgalmazo,
            "tipus": route_instance.uzemanyag.megnevezes
        })
    if not formatted_res:
        return "Fueling not found"
    return formatted_res 