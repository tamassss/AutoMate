from __future__ import annotations

from typing import Any, Dict, List

from AutoApp.models import Fueling, User, Car


def list_gas_station_cards(user: User, car: Car, limit: int = 50) -> List[Dict[str, Any]]:
    qs = (
        Fueling.objects.filter(user=user, car=car)
        .select_related("gas_station", "fuel_type")
        .order_by("-date")[:limit]
    )

    cards = []
    for f in qs:
        gs = f.gas_station
        cards.append({
            "fueling_id": f.fueling_id,
            "date": f.date,
            "price_per_liter": float(f.price_per_liter),
            "fuel_type": f.fuel_type.name,
            "gas_station": {
                "gas_station_id": gs.gas_station_id,
                "name": gs.name,
                "city": gs.city,
                "postal_code": gs.postal_code,
                "street": gs.street,
                "house_number": gs.house_number,
            } if gs else None,
        })
    return cards
