// autók kiírása
export async function getCars() {
    const token = localStorage.getItem("token")
    const response = await fetch("http://localhost:8000/api/cars", {
        headers: { Authorization: `Bearer ${token}` },
    })

    if (response.status === 401) {
        localStorage.clear()
        window.location.href = "/"
        return []
    }

    if (!response.ok) return []

    const data = await response.json()

    return data.cars ?? []
}

// autó létrehozása
export async function createCar(carData) {
    const token = localStorage.getItem("token")

    const payload = {
        license_plate: carData.license_plate,
        brand: carData.brand,
        model: carData.model,
    }

    if (carData.odometer_km !== undefined && carData.odometer_km !== null && carData.odometer_km !== "") {
        payload.odometer_km = Number(carData.odometer_km)
    }

    if (
        carData.average_consumption !== undefined &&
        carData.average_consumption !== null &&
        carData.average_consumption !== ""
    ) {
        payload.average_consumption = Number(carData.average_consumption)
    }

    const response = await fetch("http://localhost:8000/api/cars/create/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))

    if (response.status === 401) {
        localStorage.clear()
        window.location.href = "/"
        throw new Error("Lejárt a belépés. Jelentkezz be újra.")
    }

    if (!response.ok) {
        throw new Error(data.detail || "Nem sikerült létrehozni az autót")
    }

    return data
}

// autó módosítása
export async function editCar(carId, carData) {
    const token = localStorage.getItem("token")

    const payload = {}
    if (carData.license_plate !== undefined) payload.license_plate = carData.license_plate
    if (carData.brand !== undefined) payload.brand = carData.brand
    if (carData.model !== undefined) payload.model = carData.model

    if (carData.odometer_km !== undefined && carData.odometer_km !== null && carData.odometer_km !== "") {
        payload.odometer_km = Number(carData.odometer_km)
    } else if (carData.odometer_km === "" || carData.odometer_km === null) {
        payload.odometer_km = null
    }

    if (
        carData.average_consumption !== undefined &&
        carData.average_consumption !== null &&
        carData.average_consumption !== ""
    ) {
        payload.average_consumption = Number(carData.average_consumption)
    } else if (carData.average_consumption === "" || carData.average_consumption === null) {
        payload.average_consumption = null
    }

    const response = await fetch(`http://localhost:8000/api/cars/${carId}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))

    if (response.status === 401) {
        localStorage.clear()
        window.location.href = "/"
        throw new Error("Lejárt a belépés. Jelentkezz be újra.")
    }

    if (!response.ok) {
        throw new Error(data.detail || "Nem sikerült módosítani az autót")
    }

    return data
}

// választott autó
export function returnSelectedCard(carId) {
    localStorage.setItem("selected_car_id", String(carId))
    return carId
}