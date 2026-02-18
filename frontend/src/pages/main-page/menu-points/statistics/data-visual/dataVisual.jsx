import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Card from "../../../../../components/card/card";
import { getRoutes } from "../../../../../actions/routes/routeActions";
import { getFuelings } from "../../../../../actions/fuelings/fuelingActions";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function monthIndexFromDateText(datum) {
  // format expected: YYYY. MM. DD.
  if (!datum || typeof datum !== "string") return null;
  const parts = datum.split(".").map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  const month = Number(parts[1]);
  if (Number.isNaN(month) || month < 1 || month > 12) return null;
  return month - 1;
}

function monthIndexFromMonthLabel(monthLabel) {
  // format expected: YYYY. MM.
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const [routesData, fuelsData] = await Promise.all([
          getRoutes(),
          getFuelings(),
        ]);
        setRoutes(routesData);
        setFuelGroups(fuelsData);
      } catch (err) {
        setError(err.message || "Nem sikerült betölteni a grafikon adatokat.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const { distanceByMonth, litersByMonth, pricePerKmByMonth } = useMemo(() => {
    const distance = Array(12).fill(0);
    const liters = Array(12).fill(0);
    const spent = Array(12).fill(0);

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
        spent[idx] += l * p;
      }
    }

    const pricePerKm = distance.map((km, i) => {
      if (km <= 0) return 0;
      return Number((spent[i] / km).toFixed(1));
    });

    return {
      distanceByMonth: distance.map((v) => Number(v.toFixed(1))),
      litersByMonth: liters.map((v) => Number(v.toFixed(1))),
      pricePerKmByMonth: pricePerKm,
    };
  }, [routes, fuelGroups]);

  const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  const getOptions = (yTitle) => ({
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
  });

  const barData = (label, data) => ({
    labels: months,
    datasets: [
      {
        label,
        data,
        backgroundColor: "#075DBF",
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  });

  return (
    <Card>
      <div className="p-3 w-100">
        <h5 className="text-primary mb-4 fs-4 text-center">Adatábrázolás</h5>

        {loading && <p className="text-center text-light">Betöltés...</p>}
        {error && <p className="text-center text-danger">{error}</p>}

        {!loading && !error && (
          <div className="row g-4">
            <div className="col-md-6">
              <p className="text-center text-light opacity-75 small">Megtett távolság havonta</p>
              <div style={{ height: "250px" }}>
                <Bar data={barData("Km", distanceByMonth)} options={getOptions("Km")} />
              </div>
            </div>

            <div className="col-md-6">
              <p className="text-center text-light opacity-75 small">Tankolások havonta</p>
              <div style={{ height: "250px" }}>
                <Bar data={barData("Liter", litersByMonth)} options={getOptions("Liter")} />
              </div>
            </div>

            <div className="col-md-12 mt-5 d-flex flex-column align-items-center">
              <p className="text-center text-light opacity-75 small">1 km ára havonta</p>
              <div className="w-75" style={{ height: "300px" }}>
                <Bar data={barData("Ft/km", pricePerKmByMonth)} options={getOptions("Ft/km")} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}







