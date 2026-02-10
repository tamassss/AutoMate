import { Line } from "react-chartjs-2";
import { getFuelChartData } from "../../../../actions/dashboard";
import "./fuel.css"

export default function Fuel() {
    const chartData = {
        labels: ["H", "K", "Sze", "Cs", "P", "Szo", "V"],
        datasets: [
            {
                label: "Költés (Ft)",
                data: getFuelChartData(),
                borderColor: "#075DBF",
                backgroundColor: "#ffffff",
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }, 
        },
        scales: {
            y: { display: false },
            x: { grid: { display: false }, ticks: { color: "#ccc" } }
        }
    };

    return (
        <div className="fuel-container">
            <h2 className="fuel-title">Tankolás</h2>

            <div className="fuel-chart-wrap">
                <Line data={chartData} options={options} />
            </div>

            <hr className="mb-5"/>

            <table className="fuel-table">
                <tbody>
                    <tr>
                        <td className="odd text-center field" colSpan={2}>Legutóbbi tankolás <span className="last-fuel-date">(2025. 10. 20.)</span></td>
                    </tr>
                    <tr>
                        <td className="even field">Mennyiség</td>
                        <td className="even field">45 l</td>
                    </tr>
                    <tr>
                        <td className="odd field">Elköltött Pénz</td>
                        <td className="odd field">20.000 Ft</td>
                    </tr>
                    <tr>
                        <td className="even field">Becsült hatótáv</td>
                        <td className="even field">650 km</td>
                    </tr>
                    
                </tbody>
            </table>
        </div>
    );
}