import Button from "../../../components/button/button";
import GasStationCard from "../../../components/gas-station-card/gasStationCard";

export default function ModeratorPage({ pendingRequests = [], onReview }) {
  
  // Nincs kérelem
  if (pendingRequests.length === 0) {
    return (
      <div className="mt-5 text-center mb-5">
        <h3 className="text-primary mb-3">Várólista</h3>
        <p className="text-light">Nincs függőben lévő kérelem.</p>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h3 className="text-primary mb-1 text-center">Várólista</h3>

      <div className="text-center mb-4">
        <a href="https://holtankoljak.hu/#!" target="_blank" rel="noreferrer" className="text-info underline-none small">
            Segítség
        </a>
      </div>
      
      <div className="row g-4">
        {pendingRequests.map((item) => {
          const date = String(item.created_at).slice(0, 10);
          
          return (
            <div key={item.request_id} className="col-12 col-xl-6">
              <GasStationCard
                station={{ ...item.station, datum: date }}
                showDefaultActions={false}
                extraInfo={`${item.full_name} - ${item.car_name}`}
              />
              
              <div className="d-flex gap-2 justify-content-center mt-2">
                <Button 
                    text="Elfogadás" 
                    onClick={() => onReview?.(item.request_id, "accept")} 
                />
                <Button 
                    text="Elutasítás" 
                    onClick={() => onReview?.(item.request_id, "reject")} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}