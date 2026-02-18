import { useState } from "react";
import Button from "../../components/button/button";
import LabeledInput from "../../components/labeledInput/labeledInput";
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
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        setError("");
        setFieldErrors({});

        const tempErrors = {};
        if (!liters) tempErrors.liters = "A mennyiség megadása kötelező!";
        if (!pricePerLiter) tempErrors.pricePerLiter = "Az ár/liter megadása kötelező!";

        if (Object.keys(tempErrors).length > 0) {
            setFieldErrors(tempErrors);
            return;
        }

        const l = Number(liters);
        const p = Number(pricePerLiter);
        const numericErrors = {};
        if (Number.isNaN(l) || l <= 0) numericErrors.liters = "Érvényes mennyiséget adj meg (0 felett).";
        if (Number.isNaN(p) || p <= 0) numericErrors.pricePerLiter = "Érvényes árat adj meg (0 felett).";
        if (Object.keys(numericErrors).length > 0) {
            setFieldErrors(numericErrors);
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
            <LabeledInput
                label={"Mennyiség (liter)"}
                type={"number"}
                value={liters}
                onChange={(e) => {
                    setLiters(e.target.value);
                    if (fieldErrors.liters) setFieldErrors((prev) => ({ ...prev, liters: "" }));
                }}
                error={fieldErrors.liters}
            />
            <LabeledInput
                label={"Ft/liter"}
                type={"number"}
                value={pricePerLiter}
                onChange={(e) => {
                    setPricePerLiter(e.target.value);
                    if (fieldErrors.pricePerLiter) setFieldErrors((prev) => ({ ...prev, pricePerLiter: "" }));
                }}
                error={fieldErrors.pricePerLiter}
            />
            <LabeledInput label={"Km óra állás (opcionális)"} type={"number"} value={odometerKm} onChange={(e) => setOdometerKm(e.target.value)} />

            <HrOptional />
            <h3 className="full-width">Új benzinkút</h3>
            <LabeledInput label={"Benzinkút neve"} type={"text"} value={stationName} onChange={(e) => setStationName(e.target.value)} />
            <LabeledInput label={"Helység"} type={"text"} value={stationCity} onChange={(e) => setStationCity(e.target.value)} />
            <LabeledInput label={"Cím"} type={"text"} value={stationAddress} onChange={(e) => setStationAddress(e.target.value)} />
            <LabeledInput label={"Forgalmazó"} type={"text"} value={supplier} onChange={(e) => setSupplier(e.target.value)} />
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






