import { useState } from "react";
import Button from "../../components/button/button";
import LabeledInput from "../../components/labeledInput/labeledInput";
import Modal from "../../components/modal/modal";
import { clampNumberInput } from "../../actions/shared/inputValidation";

import "./editLimit.css";

export default function EditLimit({ onClose, onSave, initialLimit = 0 }) {
    const [maxLimit, setMaxLimit] = useState(String(initialLimit || 0));
    const [fieldError, setFieldError] = useState("");

    function handleSave() {
        const n = Number(maxLimit);
        if (Number.isNaN(n) || n < 0 || n > 9999999) {
            setFieldError("A maximum limit 0 és 9.999.999 között lehet.");
            return;
        }

        setFieldError("");
        onSave?.(n);
        onClose?.();
    }

    return (
        <Modal
            title={"Limit"}
            onClose={onClose}
            columns={1}
            footer={<Button text={"Mentés"} onClick={handleSave} />}
        >
            <p className="full-width">Mennyit szeretnél költeni üzemanyagra ebben a hónapban?</p>
            <LabeledInput
                label={"Maximum"}
                type={"number"}
                value={maxLimit}
                min={0}
                max={9999999}
                onChange={(e) => {
                    setMaxLimit(clampNumberInput(e.target.value, { min: 0, max: 9999999, integer: true }));
                    if (fieldError) setFieldError("");
                }}
                error={fieldError}
            />
        </Modal>
    );
}

