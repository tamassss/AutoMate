import { useEffect, useMemo, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  PointElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend 
} from "chart.js";
import Card from "../../../../../components/card/card";
import { getRoutes } from "../../../../../actions/routes/routeActions";
import { getFuelings } from "../../../../../actions/fuelings/fuelingActions";
import { getServiceLog } from "../../../../../actions/serviceLog/serviceLogActions";

// Hónap index kinyerése
function monthIndexFromDateText(datum) {
  if (!datum || typeof datum !== "string") return null;
  const parts = datum.split(".").map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  const month = Number(parts[1]);
  if (Number.isNaN(month) || month < 1 || month > 12) return null;
  return month - 1;
}

function monthIndexFromMonthLabel(monthLabel) {
  if (!monthLabel || typeof monthLabel !== "string") return null;
  const parts = monthLabel.split(".").map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  const month = Number(parts[1]);
  if (Number.isNaN(month) || month < 1 || month > 12) return null;
  return month - 1;
}

export default function DataVisual() {
  const [routes, setRoutes] = useState([]);
  const [fuelGroups, setFuelGroups] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Adatok betöltése
  useEffect(function() {
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const [routesData, fuelsData, servicesData] = await Promise.all([
          getRoutes(),
          getFuelings(),
          getServiceLog(),
        ]);
        setRoutes(routesData);
        setFuelGroups(fuelsData);
        setServices(servicesData);
      } catch (err) {
        setError(err.message || "Nem sikerült betölteni a grafikon adatokat.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Számítások
  const stats = useMemo(function() {
    const distance = Array(12).fill(0);
    const liters = Array(12).fill(0);
    const spentFuel = Array(12).fill(0);
    const spentService = Array(12).fill(0);

    for (const route of routes) {
      const idx = monthIndexFromDateText(route?.datum);
      if (idx == null) continue;
      distance[idx] += Number(route?.tavolsag || 0);
    }

    for (const group of fuelGroups) {
      const idx = monthIndexFromMonthLabel(group?.month);
      if (idx == null) continue;
      for (const item of group?.items || []) {
        const l = Number(item?.mennyiseg || 0);
        const p = Number(item?.literft || 0);
        liters[idx] += l;
        spentFuel[idx] += l * p;
      }
    }

    for (const service of services) {
      const idx = monthIndexFromDateText(service?.ido);
      if (idx == null) continue;
      const numericCost = Number(String(service?.ar || "0").replace(/[^\d]/g, ""));
      spentService[idx] += Number.isNaN(numericCost) ? 0 : numericCost;
    }

    const pricePerKm = distance.map((km, i) => {
      if (km <= 0) return 0;
      return Number((spentFuel[i] / km).toFixed(1));
    });

    return {
      distanceByMonth: distance.map((v) => Number(v.toFixed(1))),
      litersByMonth: liters.map((v) => Number(v.toFixed(1))),
      pricePerKmByMonth: pricePerKm,
      fuelSpentByMonth: spentFuel.map((v) => Number(v.toFixed(0))),
      serviceSpentByMonth: spentService.map((v) => Number(v.toFixed(0))),
    };
  }, [routes, fuelGroups, services]);

  const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  // chart.js
  function getOptions(yTitle) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(255, 255, 255, 0.1)" },
          ticks: { color: "#ccc" },
          title: {
            display: true,
            text: yTitle,
            color: "#075DBF",
            font: { size: 12, weight: "bold" },
          },
        },
        x: {
          grid: { display: false },
          ticks: { color: "#ccc" },
          title: {
            display: true,
            text: "Hónap",
            color: "#075DBF",
            font: { size: 12, weight: "bold" },
          },
        },
      },
    };
  }

  // Oszlopdiagram adatok összefűzése
  function getBarData(label, data) {
    return {
      labels: months,
      datasets: [
        {
          label: label,
          data: data,
          backgroundColor: "#075DBF",
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };
  }

  const totalFuelSpent = stats.fuelSpentByMonth.reduce((sum, value) => sum + value, 0);
  const totalServiceSpent = stats.serviceSpentByMonth.reduce((sum, value) => sum + value, 0);

  const pieData = {
    labels: ["Szerviz", "Tankolás"],
    datasets: [
      {
        data: [totalServiceSpent, totalFuelSpent],
        backgroundColor: ["#2CB67D", "#075DBF"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { color: "#ccc" } },
      tooltip: {
        callbacks: {
          label: function(ctx) {
            return ctx.label + ": " + Number(ctx.parsed || 0).toLocaleString("hu-HU") + " Ft";
          },
        },
      },
    },
  };

  return (
    <Card>
      <div className="p-3 w-100">
        <h5 className="text-primary mb-4 fs-4 text-center">
          Utak <span style={{color:"white"}}>|</span> Tankolások <span style={{color:"white"}}>|</span> Költségek
        </h5>

        {loading && <p className="text-center text-light">Betöltés...</p>}
        {error && <p className="text-center text-danger">{error}</p>}

        {!loading && !error && (
          <div className="row g-4">
            <div className="col-md-6">
              <p className="text-center text-light opacity-75 small">Megtett távolság havonta</p>
              <div style={{ height: "250px" }}>
                <Bar data={getBarData("Km", stats.distanceByMonth)} options={getOptions("Km")} />
              </div>
            </div>

            <div className="col-md-6">
              <p className="text-center text-light opacity-75 small">Tankolások havonta</p>
              <div style={{ height: "250px" }}>
                <Bar data={getBarData("Liter", stats.litersByMonth)} options={getOptions("Liter")} />
              </div>
            </div>

            <div className="col-md-6 mt-2">
              <p className="text-center text-light opacity-75 small">1 km ára havonta</p>
              <div style={{ height: "300px" }}>
                <Line
                  data={{
                    labels: months,
                    datasets: [
                      {
                        label: "Ft/km",
                        data: stats.pricePerKmByMonth,
                        borderColor: "#075DBF",
                        backgroundColor: "rgba(7, 93, 191, 0.2)",
                        fill: true,
                        tension: 0.3,
                      },
                    ],
                  }}
                  options={getOptions("Ft/km")}
                />
              </div>
            </div>

            <div className="col-md-6 mt-2">
              <p className="text-center text-light opacity-75 small">Mindenkori költségek</p>
              <div style={{ height: "300px" }}>
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
