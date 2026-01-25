import Card from "../../../../../components/card/card";
import "./allCars.css"

export default function AllCars() {
  const data = [
    { car: "Volkswagen Golf VII", distance: "3882 km", fuel: "24 db | 150000 Ft | 400 l", time: "+11 perc", tColor: "#28a745" },
    { car: "Ford Mondeo", distance: "4112 km", fuel: "24 db | 150000 Ft | 400 l", time: "+32 perc", tColor: "#28a745" },
    { car: "Dodge Ram 1500", distance: "1283 km", fuel: "24 db | 150000 Ft | 400 l", time: "-13 perc", tColor: "#dc3545" },
  ];

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
                <th>Javított / Rontott idő</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className={index % 2 !== 0 ? 'odd' : 'even'}>
                  <td>{item.car}</td>
                  <td>{item.distance}</td>
                  <td className="small">{item.fuel}</td>
                  <td style={{ color: item.tColor }}>{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}