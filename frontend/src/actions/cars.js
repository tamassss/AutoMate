//Autók kiírása
export function getCars(){
    return(
        [
            {
                car_id: 1,
                display_name: "Alfa Romeo GT",
                license_plate: "JOG-272",
                brand: "Alfa Romeo",
                model: "GT",
                username: "Sándor"
            },
            {
                car_id: 2,
                display_name: "Alfa Romeo GT 2",
                license_plate: "JOG-272",
                brand: "Alfa Romeo",
                model: "GT",
                username: "János"
            },
        ]
    )
}


//Választott autó
export function returnSelectedCard(carId){
    //fetch
    return carId;
}