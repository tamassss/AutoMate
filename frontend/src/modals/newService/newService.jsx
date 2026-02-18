import { useState } from "react";

import Button from "../../components/button/button";
import LabeledInput from "../../components/labeledInput/labeledInput";
import Modal from "../../components/modal/modal";

export default function NewService({ onClose, onSave }) {
    const today = new Date().toISOString().split("T")[0];
    const [partName, setPartName] = useState("");
    const [date, setDate] = useState(today);
    const [cost, setCost] = useState("");
    const [reminderDate, setReminderDate] = useState(today);
    const [reminderKm, setReminderKm] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        setError("");
        setFieldErrors({});

        const tempErrors = {};
        if (!partName.trim()) tempErrors.partName = "Az alkatrész megadása kötelező!";
        if (!date) tempErrors.date = "A csere idejének megadása kötelező!";
        if (Object.keys(tempErrors).length > 0) {
            setFieldErrors(tempErrors);
            return;
        }

        try {
            setIsSaving(true);
            await onSave?.({
                partName,
                date,
                cost,
                reminderDate,
                reminderKm,
            });
            onClose?.();
        } catch (err) {
            setError(err.message || "Nem sikerült menteni a szervizt.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Modal
            title={"Új szerviz"}
            onClose={onClose}
            footer={<Button text={isSaving ? "Ment..." : "Hozzáadás"} onClick={handleSave} />}
        >
            <LabeledInput
                label={"Alkatrész"}
                type={"text"}
                value={partName}
                onChange={(e) => {
                    setPartName(e.target.value);
                    if (fieldErrors.partName) setFieldErrors((prev) => ({ ...prev, partName: "" }));
                }}
                error={fieldErrors.partName}
            />
            <LabeledInput
                label={"Csere ideje"}
                type={"date"}
                value={date}
                onChange={(e) => {
                    setDate(e.target.value);
                    if (fieldErrors.date) setFieldErrors((prev) => ({ ...prev, date: "" }));
                }}
                error={fieldErrors.date}
            />
            <LabeledInput label={"Ár"} type={"number"} value={cost} onChange={(e) => setCost(e.target.value)} />
            <LabeledInput label={"Emlékeztető (dátum)"} type={"date"} value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} />
            <LabeledInput label={"Emlékeztető (km)"} type={"number"} value={reminderKm} onChange={(e) => setReminderKm(e.target.value)} />
            {error && <p className="text-danger">{error}</p>}
        </Modal>
    );
}








