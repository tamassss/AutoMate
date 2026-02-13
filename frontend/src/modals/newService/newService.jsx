import { useState } from "react";

import Button from "../../components/button/button";
import Input from "../../components/input/input";
import Modal from "../../components/modal/modal";

export default function NewService({ onClose, onSave }) {
    const [partName, setPartName] = useState("");
    const [date, setDate] = useState("");
    const [cost, setCost] = useState("");
    const [reminderDate, setReminderDate] = useState("");
    const [reminderKm, setReminderKm] = useState("");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        setError("");

        if (!partName || !date) {
            setError("Az alkatrész és a csere ideje kötelező.");
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
            <Input placeholder={"Alkatrész"} type={"text"} value={partName} onChange={(e) => setPartName(e.target.value)} />
            <Input placeholder={"Csere ideje"} type={"date"} value={date} onChange={(e) => setDate(e.target.value)} />
            <Input placeholder={"Ár"} type={"number"} value={cost} onChange={(e) => setCost(e.target.value)} />
            <Input placeholder={"Emlékeztető (dátum)"} type={"date"} value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} />
            <Input placeholder={"Emlékeztető (km)"} type={"number"} value={reminderKm} onChange={(e) => setReminderKm(e.target.value)} />
            {error && <p className="text-danger">{error}</p>}
        </Modal>
    );
}








