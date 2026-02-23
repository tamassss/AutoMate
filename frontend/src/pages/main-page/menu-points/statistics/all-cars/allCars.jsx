import Card from "../../../../../components/card/card";
import "./allCars.css";
import { formatGroupedNumber, formatMoney } from "../../../../../actions/shared/formatters";

export default function AllCars({ summaryStats = [] }) {
  const rows = summaryStats.map((item) => ({
    car: item.car_name,
    distance: `${formatGroupedNumber(item.distance_km || 0, { decimals: 1, trimTrailingZeros: true })} km`,
    fuel: `${formatGroupedNumber(item.fuelings?.count || 0)} db | ${formatMoney(item.fuelings?.spent)} | ${formatGroupedNumber(
      item.fuelings?.liters || 0,
      { decimals: 1, trimTrailingZeros: true }
    )} l`,
  }));

  return (
    <Card>
      <div className="w-100 p-3">
        <h5 className="text-center text-primary mb-3 fs-4">Összesített statisztika</h5>
        <div className="table-responsive">
          <table className="table table-dark table-borderless text-center align-middle m-0">
            <thead>
              <tr className="odd text-primary text-center">
                <th>Autó</th>
                <th>Megtett táv</th>
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
                  <td colSpan={3} className="text-center">
                    Még nincs összesített adat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
