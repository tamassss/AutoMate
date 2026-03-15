import { Bar, Line } from "react-chartjs-2";
import Modal from "../../components/modal/modal";
import "./communityComparisonModal.css";

function chartOptions(yTitle) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#ddd" } },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: yTitle, color: "#7ec8ff" },
        ticks: { color: "#ccc" },
        grid: { color: "rgba(255,255,255,0.12)" },
      },
      x: {
        ticks: { color: "#ccc" },
        grid: { display: false },
      },
    },
  };
}

function MonthlyBarChart({ title, unit, months, meValues, otherValues, meName, otherName }) {
  return (
    <div className="community-compare-chart-item">
      <p className="text-light text-center mb-2">{title}</p>
      <div style={{ height: "240px" }}>
        <Bar
          data={{
            labels: months,
            datasets: [
              { label: meName, data: meValues, backgroundColor: "#0a6ddf" },
              { label: otherName, data: otherValues, backgroundColor: "#2cb67d" },
            ],
          }}
          options={chartOptions(unit)}
        />
      </div>
    </div>
  );
}

function MonthlyLineChart({ title, unit, months, meValues, otherValues, meName, otherName }) {
  return (
    <div className="community-compare-chart-item">
      <p className="text-light text-center mb-2">{title}</p>
      <div style={{ height: "240px" }}>
        <Line
          data={{
            labels: months,
            datasets: [
              {
                label: meName,
                data: meValues,
                borderColor: "#0a6ddf",
                backgroundColor: "rgba(10,109,223,0.12)",
                fill: true,
                tension: 0.25,
              },
              {
                label: otherName,
                data: otherValues,
                borderColor: "#2cb67d",
                backgroundColor: "rgba(44,182,125,0.12)",
                fill: true,
                tension: 0.25,
              },
            ],
          }}
          options={chartOptions(unit)}
        />
      </div>
    </div>
  );
}

export default function CommunityComparisonModal({
  onClose,
  myProfile,
  otherProfile,
  compareData,
  compareLoading,
  compareError,
}) {
  const myName = myProfile?.car_name || "Saját autó";
  const otherName = otherProfile?.car_name || "Másik autó";

  return (
    <Modal title={`${myName} - ${otherName}`} onClose={onClose} columns={1} compact={false}>
      <div className="community-compare-wrap">
        {compareLoading ? <p className="text-center text-light mt-2">BetÃ¶ltÃ©s...</p> : null}
        {compareError ? <p className="text-center text-danger mt-2">{compareError}</p> : null}

        {!compareLoading && !compareError && compareData ? (
          <div className="community-compare-charts">
            <MonthlyBarChart
              title="Megtett tÃ¡volsÃ¡g havonta"
              unit="Km"
              months={compareData.months || []}
              meValues={compareData.series?.distance?.me || []}
              otherValues={compareData.series?.distance?.other || []}
              meName={myName}
              otherName={otherName}
            />
            <MonthlyBarChart
              title="Tankolt liter havonta"
              unit="Liter"
              months={compareData.months || []}
              meValues={compareData.series?.liters?.me || []}
              otherValues={compareData.series?.liters?.other || []}
              meName={myName}
              otherName={otherName}
            />
            <MonthlyLineChart
              title="1 km Ã¡ra havonta"
              unit="Ft/km"
              months={compareData.months || []}
              meValues={compareData.series?.price_per_km?.me || []}
              otherValues={compareData.series?.price_per_km?.other || []}
              meName={myName}
              otherName={otherName}
            />
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

