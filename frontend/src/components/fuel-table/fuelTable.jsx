import "./fuelTable.css"
import Card from "../card/card"
import Button from "../button/button"
import editIcon from "../../assets/icons/edit.png"
import deleteIcon from "../../assets/icons/delete.png"

export default function FuelTable({month, data}){
    return(
        <div className="mb-5">
            <h3 className="text-left mb-3 fuel-table-date" style={{ color: "#89C4FF" }}>{month}</h3>
            
            <Card>
                <table className="table table-dark mt-2">
                    <thead>
                        <tr>
                            <th>Dátum</th>
                            <th>Mennyiség</th>
                            <th>Ft/liter</th>
                            <th>Km óra állás</th>
                            <th>Funkciók</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(fuel => (
                            <tr key={fuel.id}>
                                <td>{fuel.datum}</td>
                                <td>{fuel.mennyiseg} l</td>
                                <td>{fuel.literft} Ft/l</td>
                                <td>{fuel.kmallas} km</td>
                                <td className="td-btns">
                                    <button>
                                        <img src={editIcon} className="td-btn"/>
                                    </button>
                                    <button>
                                        <img src={deleteIcon} className="td-btn"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    )
}