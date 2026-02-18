import Card from "../../../../../components/card/card";
import { formatDate } from "../../../../../actions/shared/formatters";

function formatMoney(value) {
  if (value == null) return "-";
  return `${Math.round(Number(value))} Ft`;
}

export default function GeneralStats({ generalStats }) {
  const stats = [
    {
      label: "Kiválasztott autó:",
      value: generalStats?.car?.display_name || "-",
    },
    {
      label: "Megtett táv használat óta:",
      value: generalStats?.distance_km_total != null ? `${Number(generalStats.distance_km_total).toFixed(1)} km` : "-",
    },
    {
      label: "Tankolások használat óta:",
      value:
        generalStats?.fuelings
          ? `${generalStats.fuelings.count} db | ${Number(generalStats.fuelings.liters || 0).toFixed(1)} l | ${formatMoney(generalStats.fuelings.spent)}`
          : "-",
    },
    {
      label: "Szerviz költség összesen:",
      value: generalStats?.maintenance ? formatMoney(generalStats.maintenance.total_cost) : "-",
    },
    {
      label: "Leghosszabb út:",
      value: generalStats?.longest_route
        ? `${generalStats.longest_route.from_city} - ${generalStats.longest_route.to_city} | ${Number(generalStats.longest_route.distance_km || 0).toFixed(1)} km | ${generalStats.longest_route.departure_time_hhmm || "-"} - ${generalStats.longest_route.arrival_time_hhmm || "-"}`
        : "-",
    },
    {
      label: "Utolsó szerviz dátum:",
      value: formatDate(generalStats?.maintenance?.last_date),
    },
  ];

  return (
    <Card>
      <div className="p-3 w-100">
        <h5 className="text-center text-primary mb-3 fs-4">Általános statisztikák</h5>
        <div className="container">
          {stats.map((stat, index) => (
            <div key={index} className={`row p-2 ${index % 2 === 0 ? "odd" : "even"}`}>
              <div className="col-6 text-start" style={{ color: "white", opacity: "0.7" }}>{stat.label}</div>
              <div className="col-6 stat-value" style={{ color: "white" }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}



