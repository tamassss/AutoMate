import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Card from '../../../../../components/card/card';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DataVisual() {
  const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  
  const getOptions = (yTitle) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { 
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.1)' }, 
        ticks: { color: '#ccc' },
        title: {
          display: true,
          text: yTitle,
          color: '#075DBF',
          font: { size: 12, weight: 'bold' }
        }
      },
      x: { 
        grid: { display: false }, 
        ticks: { color: '#ccc' },
        title: {
          display: true,
          text: 'Hónap',
          color: '#075DBF',
          font: { size: 12, weight: 'bold' }
        }
      }
    }
  });

  const barData = (label, data) => ({
    labels: months,
    datasets: [
      {
        label: label,
        data: data,
        backgroundColor: '#075DBF',
        borderRadius: 4,
        borderSkipped: false,
      }
    ],
  });

  return (
    <Card>
      <div className="p-3 w-100">
        <h5 className="text-primary mb-4 fs-4 text-center">Adatábrázolás</h5>
        
        <div className="row g-4">
          <div className="col-md-6">
            <p className="text-center text-light opacity-75 small">Megtett távolság havonta</p>
            <div style={{ height: "250px" }}>
              <Bar data={barData('Km', [800, 400, 550, 700, 300, 1000, 800, 600, 850, 700, 0, 0])} options={getOptions('Km')} />
            </div>
          </div>

          <div className="col-md-6">
            <p className="text-center text-light opacity-75 small">Tankolások havonta</p>
            <div style={{ height: "250px" }}>
              <Bar data={barData('Liter', [60, 30, 45, 55, 25, 80, 60, 45, 65, 55, 0, 0])} options={getOptions('Liter')} />
            </div>
          </div>

          <div className="col-md-12 mt-5 d-flex flex-column align-items-center">
            <p className="text-center text-light opacity-75 small">1 km ára havonta</p>
            <div className="w-75" style={{ height: "300px" }}>
              <Bar data={barData('Ft/km', [42, 47, 41, 51, 35, 46, 42, 49, 43, 47, 0, 0])} options={getOptions('Ft/km')} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}