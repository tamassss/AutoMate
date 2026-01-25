import "./fuel.css"
import { Line } from "react-chartjs-2";

export default function Fuel() {
    
    const chartData = {
        labels: ["H", "K", "Sze", "Cs", "P", "Szo", "V"],
        datasets: [
            {
                label: "Költés (Ft)",
                data: [5000, 0, 12000, 0, 8000, 0, 0],
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
                        <td className="odd text-center" colSpan={2}>Legutóbbi tankolás (2025. 10. 20.)</td>
                    </tr>
                    <tr>
                        <td className="even">Mennyiség</td>
                        <td className="even">45 l</td>
                    </tr>
                    <tr>
                        <td className="odd">Elköltött Pénz</td>
                        <td className="odd">20.000 Ft</td>
                    </tr>
                    <tr>
                        <td className="even">Becsült hatótáv</td>
                        <td className="even">650 km</td>
                    </tr>
                    
                </tbody>
            </table>
        </div>
    );
}