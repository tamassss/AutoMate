import { useEffect, useState } from "react";

import Button from "../../../../components/button/button";
import Card from "../../../../components/card/card";
import Navbar from "../../../../components/navbar/navbar";
import Menu from "../../dashboard/menu/menu";

import NewService from "../../../../modals/newService/newService";
import { createServiceLogEntry, getServiceLog } from "../../../../actions/serviceLog/serviceLogActions";

import "./serviceLog.css";
import "../menuLayout.css";

export default function ServiceLog() {
    const [showNewService, setShowNewService] = useState(false);
    const [services, setServices] = useState([]);
    const [error, setError] = useState("");

    async function loadServices() {
        setError("");
        try {
            const data = await getServiceLog();
            setServices(data);
        } catch (err) {
            setError(err.message || "Nem sikerült betölteni a szerviznaplót.");
            setServices([]);
        }
    }

    useEffect(() => {
        loadServices();
    }, []);

    const hasServices = services.length > 0;

    return (
        <div className="main-menu-layout">
            <div className="main-menu-content">
                <Menu />
            </div>

            <div className="flex-grow-1">
                <Navbar />

                <div className="container py-5">
                    <h1 className="text-center text-primary mb-5 fw-bold">Szerviznapló</h1>
                    <Button text={"Új szerviz"} onClick={() => setShowNewService(true)} />

                    {showNewService && (
                        <NewService
                            onClose={() => setShowNewService(false)}
                            onSave={async (formData) => {
                                await createServiceLogEntry(formData);
                                await loadServices();
                            }}
                        />
                    )}

                    <div className="mt-5">
                        {error && <p className="text-danger">{error}</p>}

                        {hasServices ? (
                            <Card>
                                <table className="custom-table mt-2">
                                    <thead>
                                        <tr>
                                            <th>Alkatrész</th>
                                            <th>Csere ideje</th>
                                            <th>Ár</th>
                                            <th>Emlékeztető</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {services.map((service) => (
                                            <tr key={service.id}>
                                                <td>{service.alkatresz}</td>
                                                <td>{service.ido}</td>
                                                <td>{service.ar}</td>
                                                <td>
                                                    <div className="reminder-date">{service.emlekeztetoDatum}</div>
                                                    {service.emlekeztetoKm && (
                                                        <div className="reminder-km">{service.emlekeztetoKm}</div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        ) : (
                            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
                                <p className="fs-5">Még nem adtál hozzá szervizt</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}








