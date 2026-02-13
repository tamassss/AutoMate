import { useState } from "react";
import Button from "../../components/button/button";
import Input from "../../components/input/input";
import Modal from "../../components/modal/modal";
import HrOptional from "../../components/hr-optional/hrOptional";
import "./newFuel.css";

export default function NewFuel({ onClose, onSave }) {
    const FUEL_OPTIONS = [
        { value: "1", label: "95 benzin" },
        { value: "2", label: "100 benzin" },
        { value: "3", label: "Diesel" },
        { value: "4", label: "Diesel Plus" },
    ];

    const [liters, setLiters] = useState("");
    const [pricePerLiter, setPricePerLiter] = useState("");
    const [odometerKm, setOdometerKm] = useState("");
    const [stationName, setStationName] = useState("");
    const [stationCity, setStationCity] = useState("");
    const [stationAddress, setStationAddress] = useState("");
    const [supplier, setSupplier] = useState("");
    const [fuelTypeId, setFuelTypeId] = useState("1");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        setError("");

        if (!liters || !pricePerLiter) {
            setError("A mennyiség és az ár/liter kötelező.");
            return;
        }

        const l = Number(liters);
        const p = Number(pricePerLiter);
        if (Number.isNaN(l) || Number.isNaN(p) || l <= 0 || p <= 0) {
            setError("Érvényes számokat adj meg.");
            return;
        }

        try {
            setIsSaving(true);
            await onSave?.({
                liters: l,
                pricePerLiter: p,
                spent: Number((l * p).toFixed(0)),
                odometerKm: odometerKm ? Number(odometerKm) : null,
                date: new Date().toISOString(),
                stationName,
                stationCity,
                stationAddress,
                supplier,
                fuelTypeId,
            });

            onClose();
        } catch (err) {
            setError(err.message || "Nem sikerült menteni a tankolást.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Modal
            title={"Új tankolás"}
            onClose={onClose}
            columns={1}
            footer={<Button text={isSaving ? "Ment..." : "Hozzáadás"} onClick={handleSave} />}
        >
            <Input placeholder={"Mennyiség (liter)"} type={"number"} value={liters} onChange={(e) => setLiters(e.target.value)} />
            <Input placeholder={"Ft/liter"} type={"number"} value={pricePerLiter} onChange={(e) => setPricePerLiter(e.target.value)} />
            <Input placeholder={"Km óra állás (opcionális)"} type={"number"} value={odometerKm} onChange={(e) => setOdometerKm(e.target.value)} />

            <HrOptional />
            <h3 className="full-width">Új benzinkút</h3>
            <Input placeholder={"Benzinkút neve"} type={"text"} value={stationName} onChange={(e) => setStationName(e.target.value)} />
            <Input placeholder={"Helység"} type={"text"} value={stationCity} onChange={(e) => setStationCity(e.target.value)} />
            <Input placeholder={"Cím"} type={"text"} value={stationAddress} onChange={(e) => setStationAddress(e.target.value)} />
            <Input placeholder={"Forgalmazó"} type={"text"} value={supplier} onChange={(e) => setSupplier(e.target.value)} />
            <div className="full-width text-start">
                <label style={{ display: "block", marginBottom: "6px" }}>Üzemanyag típusa</label>
                <select
                    value={fuelTypeId}
                    onChange={(e) => setFuelTypeId(e.target.value)}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px" }}
                >
                    {FUEL_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </Modal>
    );
}






