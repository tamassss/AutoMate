import { useState } from "react";
import Button from "../../components/button/button";
import LabeledInput from "../../components/labeledInput/labeledInput";
import Modal from "../../components/modal/modal";
import { clampNumberInput } from "../../actions/shared/inputValidation";
import SuccessModal from "../../components/success-modal/successModal";
import "./newEvent.css";

export default function NewEvent({ onClose, onSave }) {
    const today = new Date().toISOString().split("T")[0];
    const [eventName, setEventName] = useState("");
    const [date, setDate] = useState(today);
    const [km, setKm] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    async function handleSave(e) {
        e.preventDefault();
        setError("");
        setFieldErrors({});

        const tempErrors = {};
        if (!eventName.trim()) tempErrors.eventName = "Az esemény neve kötelező!";
        if (!date) tempErrors.date = "Az időpont megadása kötelező!";

        if (Object.keys(tempErrors).length > 0) {
            setFieldErrors(tempErrors);
            return;
        }

        try {
            setSaving(true);
            await onSave?.({
                partName: eventName,
                date,
                reminder: km ? `${km} km` : null,
            });
            setShowSuccess(true);
        } catch (err) {
            setError(err.message || "Nem sikerült létrehozni az eseményt.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
        <Modal
            title={"Új esemény"}
            onClose={onClose}
            columns={1}
            onSubmit={handleSave}
            footer={<Button text={saving ? "Ment..." : "Hozzáadás"} type={"submit"} />}
        >
            <LabeledInput
                label={"Esemény"}
                type={"text"}
                value={eventName}
                onChange={(e) => {
                    setEventName(e.target.value);
                    if (fieldErrors.eventName) setFieldErrors((prev) => ({ ...prev, eventName: "" }));
                }}
                error={fieldErrors.eventName}
            />
            <LabeledInput
                label={"Időpont"}
                type={"date"}
                value={date}
                onChange={(e) => {
                    setDate(e.target.value);
                    if (fieldErrors.date) setFieldErrors((prev) => ({ ...prev, date: "" }));
                }}
                error={fieldErrors.date}
            />
            <LabeledInput
                label={"Km"}
                type={"number"}
                min={0}
                max={999999}
                value={km}
                onChange={(e) => setKm(clampNumberInput(e.target.value, { min: 0, max: 999999, integer: true }))}
            />
            {error && <p className="text-danger">{error}</p>}
        </Modal>
        {showSuccess && (
            <SuccessModal
                description="Esemény sikeresen hozzáadva"
                onClose={() => {
                    setShowSuccess(false);
                    onClose?.();
                }}
            />
        )}
        </>
    );
}







