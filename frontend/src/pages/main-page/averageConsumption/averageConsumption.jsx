import { useEffect, useMemo, useState } from "react";
import Card from "../../../components/card/card";
import Navbar from "../../../components/navbar/navbar";
import "./averageConsumption.css";
import LabeledInput from "../../../components/labeledInput/labeledInput";
import Button from "../../../components/button/button";
import { editCar } from "../../../actions/cars/carsActions";

export default function AverageConsumption() {
    const selectedCarId = localStorage.getItem("selected_car_id") || "default";
    const storageKey = useMemo(() => `avg_consumption_form_${selectedCarId}`, [selectedCarId]);

    const [startKm, setStartKm] = useState("");
    const [endKm, setEndKm] = useState("");
    const [refueledLiters, setRefueledLiters] = useState("");
    const [calculatedAvg, setCalculatedAvg] = useState(null);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) return;
            const saved = JSON.parse(raw);
            setStartKm(saved.startKm ?? "");
            setEndKm(saved.endKm ?? "");
            setRefueledLiters(saved.refueledLiters ?? "");
            setCalculatedAvg(saved.calculatedAvg ?? null);
        } catch {
            // ignore invalid saved state
        }
    }, [storageKey]);

    useEffect(() => {
        localStorage.setItem(
            storageKey,
            JSON.stringify({
                startKm,
                endKm,
                refueledLiters,
                calculatedAvg,
            })
        );
    }, [startKm, endKm, refueledLiters, calculatedAvg, storageKey]);

    function handleCalculate() {
        setError("");
        setFieldErrors({});
        setSuccess("");

        const start = Number(startKm);
        const end = Number(endKm);
        const liters = Number(refueledLiters);

        const tempErrors = {};
        if (!startKm) tempErrors.startKm = "A kezdő kilométeróra-állás megadása kötelező!";
        if (!endKm) tempErrors.endKm = "A végső kilométeróra-állás megadása kötelező!";
        if (!refueledLiters) tempErrors.refueledLiters = "A tankolt mennyiség megadása kötelező!";

        if (Object.keys(tempErrors).length > 0) {
            setFieldErrors(tempErrors);
            return;
        }

        const numberErrors = {};
        if (Number.isNaN(start)) numberErrors.startKm = "Érvényes számot adj meg.";
        if (Number.isNaN(end)) numberErrors.endKm = "Érvényes számot adj meg.";
        if (Number.isNaN(liters)) numberErrors.refueledLiters = "Érvényes számot adj meg.";
        if (Object.keys(numberErrors).length > 0) {
            setFieldErrors(numberErrors);
            return;
        }

        const distance = end - start;
        if (distance <= 0) {
            setError("A második kilométeróra-állás legyen nagyobb az elsőnél.");
            return;
        }

        if (liters <= 0) {
            setError("A tankolt mennyiség legyen 0-nál nagyobb.");
            return;
        }

        const avg = (liters / distance) * 100;
        setCalculatedAvg(Number(avg.toFixed(2)));
    }

    async function handleSaveToCar() {
        if (calculatedAvg == null) {
            setError("Előbb számold ki az átlagfogyasztást.");
            return;
        }

        if (!selectedCarId || selectedCarId === "default") {
            setError("Nincs kiválasztott autó.");
            return;
        }

        try {
            setIsSaving(true);
            setError("");
            setSuccess("");
            await editCar(selectedCarId, { average_consumption: calculatedAvg });
            setSuccess(`Elmentve: ${calculatedAvg} l/100 km`);
        } catch (err) {
            setError(err.message || "Nem sikerült elmenteni az átlagfogyasztást.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="align-middle">
            <Navbar />

            <div className="container avg-cons-div">
                <h1 className="text-center custom-title">Átlagfogyasztás</h1>
                <h3 className="text-center mb-3 custom-subtitle">
                    Tudd meg, mennyit fogyaszt az autód egy rövid teszttel.
                </h3>

                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-7">
                        <Card>
                            <div className="p-3 text-start">
                                <div className="mt-2">
                                    <p><span className="step-span">1. lépés:</span> Tankold tele az autót, majd írd be a kilométeróra-állást</p>
                                    <div className="mt-3 col-12 col-sm-6 mx-auto">
                                        <LabeledInput
                                            label={"Kezdő kilométeróra-állás"}
                                            type={"number"}
                                            value={startKm}
                                            onChange={(e) => {
                                                setStartKm(e.target.value);
                                                if (fieldErrors.startKm) setFieldErrors((prev) => ({ ...prev, startKm: "" }));
                                            }}
                                            error={fieldErrors.startKm}
                                        />
                                    </div>
                                </div>

                                <hr />

                                <div>
                                    <p><span className="step-span">2. lépés:</span> Használd az autót valamennyi távon</p>
                                    <p className="small opacity-75">(minél hosszabb táv, annál pontosabb eredmény)</p>
                                </div>

                                <hr />

                                <div>
                                    <p><span className="step-span">3. lépés:</span> Ismét tankold tele, majd írd be:</p>

                                    <div className="row g-3 mt-2">
                                        <div className="col-12 col-sm-6">
                                            <LabeledInput
                                                label={"Végső kilométeróra-állás"}
                                                type={"number"}
                                                value={endKm}
                                                onChange={(e) => {
                                                    setEndKm(e.target.value);
                                                    if (fieldErrors.endKm) setFieldErrors((prev) => ({ ...prev, endKm: "" }));
                                                }}
                                                error={fieldErrors.endKm}
                                            />
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <LabeledInput
                                                label={"Tankolt mennyiség (liter)"}
                                                type={"number"}
                                                value={refueledLiters}
                                                onChange={(e) => {
                                                    setRefueledLiters(e.target.value);
                                                    if (fieldErrors.refueledLiters) setFieldErrors((prev) => ({ ...prev, refueledLiters: "" }));
                                                }}
                                                error={fieldErrors.refueledLiters}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center btn-div d-flex flex-column gap-2 mt-4">
                                    <Button text={"Kalkulálás"} onClick={handleCalculate} />
                                    {calculatedAvg != null && (
                                        <p className="text-center m-0">
                                            Számított átlagfogyasztás: <strong>{calculatedAvg} l/100 km</strong>
                                        </p>
                                    )}
                                    {calculatedAvg != null && (
                                        <Button
                                            text={isSaving ? "Mentés..." : "Mentés autóhoz"}
                                            onClick={handleSaveToCar}
                                        />
                                    )}
                                    {error && <p className="text-danger text-center m-0">{error}</p>}
                                    {success && <p className="text-success text-center m-0">{success}</p>}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
