import { Line } from "react-chartjs-2";
import { formatDateLocale, formatGroupedNumber, formatMoney } from "../../../../actions/shared/formatters";
import "./fuel.css";

export default function Fuel({ fuelingChart, latestFueling }) {
  const points = fuelingChart?.points || [];
  const chartLabels = ["H", "K", "SZE", "CS", "P", "SZO", "V"];

  // Adatok előkészítése
  const spentData = points.map((p) => Number(p.spent || 0));
  const litersData = points.map((p) => Number(p.liters || 0));

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Költés",
        data: spentData,
        borderColor: "#075DBF",
        backgroundColor: "#075DBF",
        tension: 0.35,
        pointRadius: 4,
      },
      {
        label: "Liter",
        data: litersData,
        borderColor: "#44d062",
        backgroundColor: "#44d062",
        tension: 0.35,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
      },
      x: {
        ticks: { color: "white" },
      },
    },
  };

  return (
    <div className="fuel-container">
      <div className="fuel-heading">
        <h2 className="fuel-title-main">Tankolás</h2>
        <p className="fuel-subtitle">Heti fogyasztás</p>
      </div>

      <div className="fuel-chart-wrap">
        <Line data={chartData} options={options} />
      </div>

      <hr className="mb-5" />

      <table className="fuel-table">
        <tbody>
          <tr>
            <td className="odd text-center field last-fuel-title" colSpan={2}>
              Legutóbbi tankolás{" "}
              <span className="last-fuel-date">{formatDateLocale(latestFueling?.date)}</span>
            </td>
          </tr>
          <tr>
            <td className="even field">Mennyiség</td>
            <td className="even field">
              {formatGroupedNumber(latestFueling?.liters || 0, { decimals: 2 })} l
            </td>
          </tr>
          <tr>
            <td className="odd field">Elköltött pénz</td>
            <td className="odd field">{formatMoney(latestFueling?.spent || 0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}