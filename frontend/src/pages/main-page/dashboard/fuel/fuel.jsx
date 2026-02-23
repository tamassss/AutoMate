import { Line } from "react-chartjs-2";
import { formatDateLocale, formatGroupedNumber, formatMoney } from "../../../../actions/shared/formatters";
import "./fuel.css";

export default function Fuel({ fuelingChart, latestFueling }) {
  const points = fuelingChart?.points || [];

  const chartLabels = ["H", "K", "SZE", "CS", "P", "SZO", "V"];

  const spentData = points.map((p) => Number(p.spent ?? p.value ?? 0));
  const litersData = points.map((p) => Number(p.liters ?? 0));

  function formatLiters(value) {
    return `${formatGroupedNumber(value || 0, { decimals: 2 })} l`;
  }

  function formatSpent(value) {
    return formatMoney(value || 0);
  }

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Költés (Ft)",
        data: spentData,
        borderColor: "#075DBF",
        backgroundColor: "#075DBF",
        tension: 0.35,
        clip: false,
        yAxisID: "ySpent",
      },
      {
        label: "Tankolt liter",
        data: litersData,
        borderColor: "#44d062",
        backgroundColor: "#44d062",
        tension: 0.35,
        clip: false,
        yAxisID: "yLiters",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { bottom: 8 },
    },
    plugins: {
      legend: {
        display: true,
        labels: { color: "#d8d8d8", boxWidth: 10, font: { size: 11 } },
      },
    },
    scales: {
      ySpent: { display: false, beginAtZero: true, min: 0, grace: "5%" },
      yLiters: { display: false, beginAtZero: true, min: 0, grace: "5%" },
      x: { grid: { display: false }, ticks: { color: "#ccc" } },
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
            <td className="odd text-center field" colSpan={2}>
              Legutóbbi tankolás{" "}
              <span className="last-fuel-date">{formatDateLocale(latestFueling?.date)}</span>
            </td>
          </tr>
          <tr>
            <td className="even field">Mennyiség</td>
            <td className="even field">{formatLiters(latestFueling?.liters)}</td>
          </tr>
          <tr>
            <td className="odd field">Elköltött pénz</td>
            <td className="odd field">{formatSpent(latestFueling?.spent)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
