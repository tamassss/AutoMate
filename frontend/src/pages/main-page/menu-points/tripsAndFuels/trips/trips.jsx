import "./trips.css"
import TripCard from "../../../../../components/trip-card/tripCard";

export default function Trips({trips}){
    if (trips.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
                <p className="fs-4">Még nincsenek rögzített Utak.</p>
            </div>
        );
    }

    return (
        <div className="row g-4">
            {trips.map(trip => (
                <div key={trip.id} className="col-xl-3 col-lg-4 col-md-6 col-10 d-flex align-items-stretch">
                    <TripCard trip={trip} />
                </div>
            ))}
        </div>
    );
}