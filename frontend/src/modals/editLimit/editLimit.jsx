import { useState } from "react";
import Button from "../../components/button/button";
import Input from "../../components/input/input";
import Modal from "../../components/modal/modal";

import "./editLimit.css";

export default function EditLimit({ onClose, onSave, initialLimit = 0 }) {
    const [maxLimit, setMaxLimit] = useState(String(initialLimit || 0));
    const [error, setError] = useState("");

    function handleSave() {
        const n = Number(maxLimit);
        if (Number.isNaN(n) || n < 0) {
            setError("A maximum limit legalabb 0 lehet.");
            return;
        }

        onSave?.(n);
        onClose?.();
    }

    return (
        <Modal
            title={"Limit"}
            onClose={onClose}
            columns={1}
            footer={<Button text={"Mentes"} onClick={handleSave} />}
        >
            <p className="full-width">Mennyit szeretnel kolteni uzemanyagra ebben a honapban?</p>
            <p className="full-width">Minimum: 0 Ft (fix)</p>
            <Input type={"number"} placeholder={"Maximum"} value={maxLimit} onChange={(e) => setMaxLimit(e.target.value)} />
            {error && <p className="text-danger">{error}</p>}
        </Modal>
    );
}

