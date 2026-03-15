import { useEffect, useState } from "react";
import Card from "../../../components/card/card";
import Navbar from "../../../components/navbar/navbar";
import LabeledInput from "../../../components/labeledInput/labeledInput";
import Button from "../../../components/button/button";
import SuccessModal from "../../../components/success-modal/successModal";
import { editCar } from "../../../actions/cars/carsActions";
import "./averageConsumption.css";

export default function AverageConsumption() {
    const selectedCarId = localStorage.getItem("selected_car_id") || "default";
    const storageKey = `avg_consumption_form_${selectedCarId}`;

    // Adatok tárolása
    const [form, setForm] = useState({
        startKm: "",
        endKm: "",
        refueledLiters: ""
    });
    
    const [calculatedAvg, setCalculatedAvg] = useState(null);
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Adatok betöltése
    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            const parsed = JSON.parse(saved);
            setForm({
                startKm: parsed.startKm || "",
                endKm: parsed.endKm || "",
                refueledLiters: parsed.refueledLiters || ""
            });
            setCalculatedAvg(parsed.calculatedAvg || null);
        }
    }, [storageKey]);

    // Adatok mentése (ls)
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify({ ...form, calculatedAvg }));
    }, [form, calculatedAvg, storageKey]);

    const handleInput = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setError("");
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        const { startKm, endKm, refueledLiters } = form;

        if (!startKm || !endKm || !refueledLiters) {
            setError("Minden mezőt tölts ki!");
            return;
        }

        const distance = Number(endKm) - Number(startKm);
        if (distance <= 0) {
            setError("A második kilométeróra-állás legyen nagyobb az elsőnél.");
            return;
        }

        const avg = (Number(refueledLiters) / distance) * 100;
        setCalculatedAvg(Number(avg.toFixed(2)));
    };

    const handleSaveToCar = async () => {
        if (!selectedCarId || selectedCarId === "default") {
            setError("Nincs kiválasztott autó.");
            return;
        }

        setIsSaving(true);
        try {
            await editCar(selectedCarId, { average_consumption: calculatedAvg });
            setShowSuccess(true);
        } catch (err) {
            setError("Nem sikerült elmenteni az átlagfogyasztást.");
        } finally {
            setIsSaving(false);
        }
    };

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
                                <form onSubmit={handleCalculate}>
                                    <div className="mt-2">
                                        <p><span className="step-span">1. lépés:</span> Tankold tele az autót, majd írd be a kilométeróra-állást</p>
                                        <div className="mt-3 col-12 col-sm-6 mx-auto">
                                            <LabeledInput
                                                label="Kezdő kilométeróra-állás"
                                                type="number"
                                                value={form.startKm}
                                                onChange={e => handleInput("startKm", e.target.value)}
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
                                                    label="Végső kilométeróra-állás"
                                                    type="number"
                                                    value={form.endKm}
                                                    onChange={e => handleInput("endKm", e.target.value)}
                                                />
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <LabeledInput
                                                    label="Tankolt mennyiség (liter)"
                                                    type="number"
                                                    value={form.refueledLiters}
                                                    onChange={e => handleInput("refueledLiters", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center btn-div d-flex flex-column gap-2 mt-4">
                                        <Button text="Kalkulálás" type="submit" />
                                    </div>
                                </form>

                                <div className="text-center btn-div d-flex flex-column gap-2">
                                    {calculatedAvg != null && (
                                        <>
                                            <p className="text-center m-0">
                                                Számított átlagfogyasztás: <strong>{calculatedAvg} l/100 km</strong>
                                            </p>
                                            <Button
                                                text={isSaving ? "Mentés..." : "Mentés autóhoz"}
                                                onClick={handleSaveToCar}
                                            />
                                        </>
                                    )}
                                    {error && <p className="text-danger text-center m-0">{error}</p>}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {showSuccess && (
                <SuccessModal
                    description="Átlag fogyasztás sikeresen elmentve"
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </div>
    );
}