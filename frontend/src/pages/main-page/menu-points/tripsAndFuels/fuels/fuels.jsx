import "./fuels.css"
import FuelTable from "../../../../../components/fuel-table/fuelTable";

export default function Fuels({fuels}){
    if (fuels.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
                <p className="fs-4">Még nincsenek rögzített Tankolások.</p>
            </div>
        );
    }

    const honapok = [...new Set(fuels.map(f => f.datum.substring(0, 8)))];

    return (
        <div className="container pb-5">
            {honapok.map((honap) => (
                <FuelTable 
                    key={honap}
                    month={honap} 
                    data={fuels.filter(f => f.datum.startsWith(honap))} 
                />
            ))}
        </div>
    );
}