import { useState } from "react";
import Button from "../../components/button/button";
import Input from "../../components/input/input";
import Modal from "../../components/modal/modal";
import { estimateRoute } from "../../actions/dashboard";
import "./newTrip.css";

function toHHMM(d) {
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function NewTrip({ onClose, avgConsumption, onStart }) {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleEstimate() {
        setError("");
        setResult(null);
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
            startTime: toHHMM(now),
            expectedArrival: toHHMM(arrival),
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
            <Input placeholder={"Honnan"} type={"text"} value={from} onChange={(e) => setFrom(e.target.value)} />
            <Input placeholder={"Hová"} type={"text"} value={to} onChange={(e) => setTo(e.target.value)} />

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
