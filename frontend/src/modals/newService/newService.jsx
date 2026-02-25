import { useState } from "react";

import Button from "../../components/button/button";
import LabeledInput from "../../components/labeledInput/labeledInput";
import Modal from "../../components/modal/modal";
import { clampNumberInput, limitTextLength } from "../../actions/shared/inputValidation";
import SuccessModal from "../../components/success-modal/successModal";

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
    const [showSuccess, setShowSuccess] = useState(false);

    async function handleSave(e) {
        e.preventDefault();
        setError("");
        setFieldErrors({});

        const tempErrors = {};
        if (!partName.trim()) tempErrors.partName = "Az alkatrész megadása kötelező!";
        if (!date) tempErrors.date = "A csere idejének megadása kötelező!";
        if (cost && Number(cost) > 999999999) tempErrors.cost = "Az ár maximum 999999999 lehet.";
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
            setShowSuccess(true);
        } catch (err) {
            setError(err.message || "Nem sikerült menteni a szervizt.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <>
        <Modal
            title={"Új szerviz"}
            onClose={onClose}
            onSubmit={handleSave}
            footer={<Button text={isSaving ? "Ment..." : "Hozzáadás"} type={"submit"} />}
        >
            <LabeledInput
                label={"Alkatrész"}
                type={"text"}
                value={partName}
                maxLength={50}
                onChange={(e) => {
                    setPartName(limitTextLength(e.target.value, 50));
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
            <LabeledInput
                label={"Ár"}
                type={"number"}
                min={0}
                max={999999999}
                value={cost}
                onChange={(e) => {
                    setCost(clampNumberInput(e.target.value, { min: 0, max: 999999999, integer: true }));
                    if (fieldErrors.cost) setFieldErrors((prev) => ({ ...prev, cost: "" }));
                }}
                error={fieldErrors.cost}
            />
            <LabeledInput label={"Emlékeztető (dátum)"} type={"date"} value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} />
            <LabeledInput
                label={"Emlékeztető (km)"}
                type={"number"}
                min={0}
                max={999999}
                value={reminderKm}
                onChange={(e) => setReminderKm(clampNumberInput(e.target.value, { min: 0, max: 999999, integer: true }))}
            />
            {error && <p className="text-danger">{error}</p>}
        </Modal>
        {showSuccess && (
            <SuccessModal
                description="Szerviz sikeresen hozzáadva"
                onClose={() => {
                    setShowSuccess(false);
                    onClose?.();
                }}
            />
        )}
        </>
    );
}








