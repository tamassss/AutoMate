import { useState } from "react";
import Button from "../../components/button/button";
import LabeledInput from "../../components/labeledInput/labeledInput";
import Modal from "../../components/modal/modal";
import { estimateRoute } from "../../actions/trips/routeEstimateActions";
import { formatHHMMFromDate } from "../../actions/shared/formatters";
import "./newTrip.css";

export default function NewTrip({ onClose, avgConsumption, onStart }) {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

    async function handleEstimate() {
        setError("");
        setFieldErrors({});
        setResult(null);

        const tempErrors = {};
        if (!from.trim()) tempErrors.from = "A kiindulási hely megadása kötelező!";
        if (!to.trim()) tempErrors.to = "A célállomás megadása kötelező!";

        if (Object.keys(tempErrors).length > 0) {
            setFieldErrors(tempErrors);
            return;
        }

        setLoading(true);
        try {
            const data = await estimateRoute(from, to, avgConsumption);
            setResult(data);
        } catch (err) {
            setError(err.message || "Hiba útvonal számítás közben");
        } finally {
            setLoading(false);
        }
    }

    function handleStartTrip() {
        const tempErrors = {};
        if (!from.trim()) tempErrors.from = "A kiindulási hely megadása kötelező!";
        if (!to.trim()) tempErrors.to = "A célállomás megadása kötelező!";
        if (Object.keys(tempErrors).length > 0) {
            setFieldErrors(tempErrors);
            return;
        }

        if (!result) {
            setError("Először számold ki az utat.");
            return;
        }

        const now = new Date();
        const arrival = new Date(now.getTime() + result.minutes * 60000);
        const avg = avgConsumption !== undefined && avgConsumption !== null && avgConsumption !== ""
            ? Number(avgConsumption)
            : null;

        onStart?.({
            title: `${from} - ${to}`,
            from,
            to,
            startTime: formatHHMMFromDate(now),
            expectedArrival: formatHHMMFromDate(arrival),
            distanceKm: result.km,
            avgConsumption: avg,
            expectedConsumptionLiters: result.liters,
            fuelings: [],
        });

        onClose();
    }

    return (
        <Modal
            title={"Új út"}
            onClose={onClose}
            columns={1}
            footer={<Button text={"Út indítása"} onClick={handleStartTrip} />}
        >
            <LabeledInput
                label={"Honnan"}
                type={"text"}
                value={from}
                onChange={(e) => {
                    setFrom(e.target.value);
                    if (fieldErrors.from) setFieldErrors((prev) => ({ ...prev, from: "" }));
                }}
                error={fieldErrors.from}
            />
            <LabeledInput
                label={"Hová"}
                type={"text"}
                value={to}
                onChange={(e) => {
                    setTo(e.target.value);
                    if (fieldErrors.to) setFieldErrors((prev) => ({ ...prev, to: "" }));
                }}
                error={fieldErrors.to}
            />

            <div style={{ marginTop: "10px" }}>
                <Button text={loading ? "Számítás..." : "Számítás"} onClick={handleEstimate} />
            </div>

            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

            {result && (
                <div style={{ marginTop: "12px", textAlign: "left" }}>
                    <p>Távolság: {result.km} km</p>
                    <p>Várható idő: kb. {result.minutes} perc</p>
                    <p>Várható fogyasztás: {result.liters ?? "-"} l</p>
                </div>
            )}
        </Modal>
    );
}
