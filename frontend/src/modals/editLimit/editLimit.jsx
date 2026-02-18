import { useState } from "react";
import Button from "../../components/button/button";
import LabeledInput from "../../components/labeledInput/labeledInput";
import Modal from "../../components/modal/modal";

import "./editLimit.css";

export default function EditLimit({ onClose, onSave, initialLimit = 0 }) {
    const [maxLimit, setMaxLimit] = useState(String(initialLimit || 0));
    const [fieldError, setFieldError] = useState("");

    function handleSave() {
        const n = Number(maxLimit);
        if (Number.isNaN(n) || n < 0) {
            setFieldError("A maximum limit legalább 0 lehet.");
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
            <p className="full-width">Minimum: 0 Ft (fix)</p>
            <LabeledInput
                label={"Maximum"}
                type={"number"}
                value={maxLimit}
                onChange={(e) => {
                    setMaxLimit(e.target.value);
                    if (fieldError) setFieldError("");
                }}
                error={fieldError}
            />
        </Modal>
    );
}

