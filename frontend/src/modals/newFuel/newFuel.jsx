import { useState } from "react";
import Button from "../../components/button/button";
import LabeledInput from "../../components/labeledInput/labeledInput";
import Modal from "../../components/modal/modal";
import HrOptional from "../../components/hr-optional/hrOptional";
import { clampNumberInput } from "../../actions/shared/inputValidation";
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
        if (Number.isNaN(l) || l < 1 || l > 100) numericErrors.liters = "A mennyiség 1 és 100 liter között lehet.";
        if (Number.isNaN(p) || p < 1 || p > 1000) numericErrors.pricePerLiter = "Az ár/liter 1 és 1000 között lehet.";
        if (odometerKm !== "") {
            const o = Number(odometerKm);
            if (Number.isNaN(o) || o < 0 || o > 999999) numericErrors.odometerKm = "A km óra állás 0 és 999999 között lehet.";
        }
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
                min={1}
                max={100}
                onChange={(e) => {
                    setLiters(clampNumberInput(e.target.value, { min: 1, max: 100, decimals: 2 }));
                    if (fieldErrors.liters) setFieldErrors((prev) => ({ ...prev, liters: "" }));
                }}
                error={fieldErrors.liters}
            />
            <LabeledInput
                label={"Ft/liter"}
                type={"number"}
                value={pricePerLiter}
                min={1}
                max={1000}
                onChange={(e) => {
                    setPricePerLiter(clampNumberInput(e.target.value, { min: 1, max: 1000, decimals: 2 }));
                    if (fieldErrors.pricePerLiter) setFieldErrors((prev) => ({ ...prev, pricePerLiter: "" }));
                }}
                error={fieldErrors.pricePerLiter}
            />
            <LabeledInput
                label={"Km óra állás (opcionális)"}
                type={"number"}
                value={odometerKm}
                min={0}
                max={999999}
                onChange={(e) => {
                    setOdometerKm(clampNumberInput(e.target.value, { min: 0, max: 999999, integer: true }));
                    if (fieldErrors.odometerKm) setFieldErrors((prev) => ({ ...prev, odometerKm: "" }));
                }}
                error={fieldErrors.odometerKm}
            />

            {error && <p style={{ color: "red" }}>{error}</p>}
        </Modal>
    );
}





