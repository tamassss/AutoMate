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
            <h2 style={{color:"#4a9fff"}} className="trip-title">{tripData.from} – {tripData.to}</h2>

            <table className="trip-table">
                <tbody>
                    <tr>
                        <td className="odd field">Indulás</td>
                        <td className="odd field">{tripData.startTime}</td>
                    </tr>
                    <tr>
                        <td className="even field">Várható érkezés</td>
                        <td className="even field">{tripData.expectedArrival}</td>
                    </tr>
                    <tr>
                        <td className="odd field">Út hossza</td>
                        <td className="odd field">{tripData.distance}</td>
                    </tr>
                    <tr>
                        <td className="even field">Várható fogyasztás</td>
                        <td className="even field">{tripData.expectedConsumption}</td>
                    </tr>
                    <tr>
                        <td className="odd field">Út ára</td>
                        <td className="odd field">{tripData.tripPrice}</td>
                    </tr>
                    <tr>
                        <td className="even field">Tankolások száma</td>
                        <td className="even field">{tripData.refuelCount}</td>
                    </tr>
                    <tr>
                        <td className="odd field">Tankolt mennyiség</td>
                        <td className="odd field">{tripData.refuelAmount}</td>
                    </tr>
                    <tr>
                        <td className="even field"><p className="field">Elköltött pénz</p></td>
                        <td className="even field">{tripData.moneySpent}</td>
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