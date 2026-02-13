import { useState } from "react";
import Button from "../../components/button/button";
import Input from "../../components/input/input";
import Modal from "../../components/modal/modal";
import "./newEvent.css";

export default function NewEvent({ onClose, onSave }) {
    const [eventName, setEventName] = useState("");
    const [date, setDate] = useState("");
    const [km, setKm] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        setError("");

        if (!eventName || !date) {
            setError("Az esemény neve és az időpont kötelező.");
            return;
        }

        try {
            setSaving(true);
            await onSave?.({
                partName: eventName,
                date,
                reminder: km || null,
            });
        } catch (err) {
            setError(err.message || "Nem sikerült létrehozni az eseményt.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal
            title={"Új esemény"}
            onClose={onClose}
            columns={1}
            footer={<Button text={saving ? "Ment..." : "Hozzáadás"} onClick={handleSave} />}
        >
            <Input placeholder={"Esemény"} type={"text"} value={eventName} onChange={(e) => setEventName(e.target.value)} />
            <Input placeholder={"Időpont"} type={"date"} value={date} onChange={(e) => setDate(e.target.value)} />
            <Input placeholder={"Km"} type={"number"} value={km} onChange={(e) => setKm(e.target.value)} />
            {error && <p className="text-danger">{error}</p>}
        </Modal>
    );
}







