//limit
export function getBudget(){
    return(
        {
            spent: 20000,
            limit: 50000,
        }
    )
}

//grafikon adatok
export function getFuelChartData(){
    return(
        [12, 8, 25]
    )
}

//sidebar eventek
export function getSidebarEvents(){
    return(
        [
            {
                maintenance_id: 1,
                part_name: "Olajcsere1",
                remaining_km: 1234,
                remaining_day: 24,
            },
            {
                maintenance_id: 2,
                part_name: "Olajcsere2",
                remaining_km: 1234,
                remaining_day: 24,
            },
            {
                maintenance_id: 3,
                part_name: "Olajcsere3",
                remaining_km: 1234,
                remaining_day: 24,
            },
        ]
    )
}

//folyamatban lévő út
export default function getOngoingTrip(){
    return(
        
    )
}