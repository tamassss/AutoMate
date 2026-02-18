import Card from "../card/card"
import "./tripCard.css"
import Button from "../button/button";

export default function TripCard({ trip }) {
    return (
        <Card>
            <div className="trip-card-header">
                <h3>{trip.honnan}</h3>
                <p>-</p>
                <h3>{trip.hova}</h3>
            </div>
            <div className="w-100 hr-div">
                <hr className="full-width"/>
            </div>
            <div className="trip-card-body">
                <p className="trip-date mt-3">{trip.datum}</p>
                <p className="trip-time">{trip.kezdes} - {trip.vege}</p>
                <p className={`trip-stat ${trip.javitas >= 0 ? 'text-success' : 'text-danger'}`}>
                    {Math.abs(trip.javitas)} perc {trip.javitas >= 0 ? 'javítás' : 'rontás'}
                </p>
                <p className="trip-distance mb-3">{trip.tavolsag} km</p>
            </div>
            <div className="trip-card-footer">
                <div style={{color:"#ffffff8e"}}>{trip.tankolas_szam} tankolás</div>
                <div style={{color:"#ffffff8e"}}>{trip.koltseg} Ft elköltve</div>
                
            </div>
            <div className="d-flex gap-2 ">
                <div className="fuel-button">
                    <Button 
                        text="Módosítás"
                    />
                </div>
                <div className="fuel-button">
                    <Button 
                        text="Törlés"
                    />
                </div>
            </div>
        </Card>
    );
}