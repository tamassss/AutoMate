import Card from "../../../../../components/card/card";

export default function GeneralStats() {
  const stats = [
    { label: "Regisztrálás időpontja:", value: "2024. 12. 24." },
    { label: "Megtett táv használat óta:", value: "4112 km" },
    { label: "Tankolások használat óta:", value: "24 db | 308 l | 175 800 Ft" },
    { label: "Javított / Rontott idő:", value: "32 perc javítás", color: "#28a745" },
    { label: "Leghosszabb út:", value: "Budapest - Zágráb | 343 km | 03:46:39" },
  ];

  return (
    <Card>
      <div className="p-3 w-100">
        <h5 className="text-center text-primary mb-3 fs-4">Általános statisztikák</h5>
        <div className="container">
          {stats.map((stat, index) => (
            <div key={index} className={`row p-2 ${index % 2 === 0 ? 'odd' : 'even'}`}>
              <div className="col-6 text-end" style={{color:"white", opacity:"0.7"}}>{stat.label}</div>
              <div className="col-6 stat-value" style={{ color: stat.color || 'white' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}