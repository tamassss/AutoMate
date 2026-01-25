import "./fuelTable.css"
import Card from "../card/card"

export default function FuelTable({month, data}){
    return(
        <div className="mb-5">
            <h3 className="text-left mb-3" style={{ color: "#89C4FF" }}>{month}</h3>
            
            <Card>
                <table className="table table-dark table-hover mt-2" style={{ borderRadius: "20px", overflow: "hidden" }}>
                    <thead>
                        <tr>
                            <th>Dátum</th>
                            <th>Mennyiség</th>
                            <th>Ft/liter</th>
                            <th>Km óra állás</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(fuel => (
                            <tr key={fuel.id}>
                                <td>{fuel.datum}</td>
                                <td>{fuel.mennyiseg} l</td>
                                <td>{fuel.literft} Ft/l</td>
                                <td>{fuel.kmallas} km</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    )
}