import Button from "../../../../components/button/button";
import "./trip.css"

export default function Trip() {
    const tripData = {
        from: "Göd",
        to: "Mogyoród",
        startTime: "15:13",
        expectedArrival: "15:33",
        distance: "16 km",
        expectedConsumption: "1.20 l",
        tripPrice: "684 Ft",
        refuelCount: "1",
        refuelAmount: "5 l",
        moneySpent: "2850 Ft",
        timer: "09 : 34 : 48"
    };

    return (
        <div className="ongoing-trip-container mt-1">
            <h2 style={{color:"#075DBF"}}>{tripData.from} – {tripData.to}</h2>

            <table className="trip-table">
                <tbody>
                    <tr>
                        <td className="odd">Indulás</td>
                        <td className="odd">{tripData.startTime}</td>
                    </tr>
                    <tr>
                        <td className="even">Várható érkezés</td>
                        <td className="even">{tripData.expectedArrival}</td>
                    </tr>
                    <tr>
                        <td className="odd">Út hossza</td>
                        <td className="odd">{tripData.distance}</td>
                    </tr>
                    <tr>
                        <td className="even">Várható fogyasztás</td>
                        <td className="even">{tripData.expectedConsumption}</td>
                    </tr>
                    <tr>
                        <td className="odd">Út ára</td>
                        <td className="odd">{tripData.tripPrice}</td>
                    </tr>
                    <tr>
                        <td className="even">Tankolások száma</td>
                        <td className="even">{tripData.refuelCount}</td>
                    </tr>
                    <tr>
                        <td className="odd">Tankolt mennyiség</td>
                        <td className="odd">{tripData.refuelAmount}</td>
                    </tr>
                    <tr>
                        <td className="even">Elköltött pénz</td>
                        <td className="even">{tripData.moneySpent}</td>
                    </tr>
                </tbody>
            </table>

            <div className="trip-timer mt-1">
                {tripData.timer}
            </div>

            <div className="trip-controls">
                <Button 
                    className="btn-pause"
                    text={"szünet"}
                />
                <Button 
                    className="btn-finish"
                    text={"út befejezése"}
                />
            </div>
        </div>
    );
}