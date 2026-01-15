from AutoApp.models import UtvonalHasznalat

def format_time(time_block) -> str:
    time = str(time_block).zfill(4)
    return f"{time[:2]}:{time[2:]}"

def get_latest_routes(user_id, limit=2):
    latest_routes = (
        UtvonalHasznalat.objects
        .filter(felhasznalo_id=user_id)
        .order_by('-datum')[:limit]
    )

    formatted_res = []
    for route_instance in latest_routes:
        formatted_res.append({
            "honna": route_instance.utvonal.honnan_cim.varos,
            "hova": route_instance.utvonal.hova_cim.varos,
            "datum": route_instance.datum.strftime("%Y-%m-%d"),
            "hossz": route_instance.hossz,
            "indulas": format_time(route_instance.indulas),
            "erkezes": format_time(route_instance.erkezes)
        })
    if not formatted_res:
        return "Routes not found"
    return formatted_res 
