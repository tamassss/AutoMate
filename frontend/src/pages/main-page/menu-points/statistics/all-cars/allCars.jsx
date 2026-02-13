import Card from "../../../../../components/card/card";
import "./allCars.css";

function formatMoney(value) {
  if (value == null) return "-";
  return `${Math.round(Number(value))} Ft`;
}

export default function AllCars({ summaryStats = [] }) {
  const rows = summaryStats.map((item) => ({
    car: item.car_name,
    distance: `${Number(item.distance_km || 0).toFixed(1)} km`,
    fuel: `${item.fuelings?.count || 0} db | ${formatMoney(item.fuelings?.spent)} | ${Number(item.fuelings?.liters || 0).toFixed(1)} l`,
  }));

  return (
    <Card>
      <div className="w-100 p-3">
        <h5 className="text-center text-primary mb-3 fs-4">Osszesitett statisztika</h5>
        <div className="table-responsive">
          <table className="table table-dark table-borderless text-center align-middle m-0">
            <thead>
              <tr className="odd text-primary text-center">
                <th>Auto</th>
                <th>Megtett tav</th>
                <th>Tankolások</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((item, index) => (
                  <tr key={index} className={index % 2 !== 0 ? "odd" : "even"}>
                    <td>{item.car}</td>
                    <td>{item.distance}</td>
                    <td className="small">{item.fuel}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center">Még nincs összesített adat.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}


