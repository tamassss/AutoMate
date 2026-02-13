import { useEffect, useState } from "react"
import Button from "../../components/button/button"
import HrOptional from "../../components/hr-optional/hrOptional"
import LabeledInput from "../../components/labeledInput/labeledInput"
import Modal from "../../components/modal/modal"
import "./editCar.css"
import { editCar } from "../../actions/cars"

export default function EditCar({onClose, onSave, selectedCar}){
    const [brandId, setBrandId] = useState("");
    const [modelId, setModelId] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [odometerKm, setOdometerKm] = useState("");
    const [averageCons, setAverageCons] = useState("");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        if (!selectedCar) return;

        setBrandId(selectedCar.brand || "");
        setModelId(selectedCar.model || "");
        setLicensePlate(selectedCar.license_plate || "");
        setOdometerKm(
            selectedCar.odometer_km === null || selectedCar.odometer_km === undefined
                ? ""
                : String(selectedCar.odometer_km)
        );
        setAverageCons(
            selectedCar.average_consumption === null || selectedCar.average_consumption === undefined
                ? ""
                : String(selectedCar.average_consumption)
        );
    }, [selectedCar]);

    async function handleEditCar() {
        setError(null);
        setFieldErrors({});

        let tempErrors = {};
        if (!brandId) tempErrors.brand = "A márka megadása kötelező!";
        if (!modelId) tempErrors.model = "A modell megadása kötelező!";
        if (!licensePlate) tempErrors.plate = "A rendszám megadása kötelező!";

        if (Object.keys(tempErrors).length > 0) {
            setFieldErrors(tempErrors);
            return;
        }

        if (!selectedCar?.car_id) {
            setError("Nincs kiválasztott autó.");
            return;
        }

        setIsSaving(true);

        try {
            await editCar(selectedCar.car_id, {
                license_plate: licensePlate,
                brand: brandId,
                model: modelId,
                odometer_km: odometerKm,
                average_consumption: averageCons,
            });

            onSave?.();
        } catch (err) {
            setError(err.message || "Nem sikerült módosítani az autót");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <>
            <Modal
                title="Autó módosítás"
                columns={1}
                onClose={onClose}
                footer={<Button text={isSaving ? "Mentés..." : "Módosítás"} onClick={handleEditCar} />}
            >
                <LabeledInput
                    label={"Márka"}
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    error={fieldErrors.brand}
                />

                <LabeledInput
                    label={"Modell"}
                    value={modelId}
                    onChange={(e) => setModelId(e.target.value)}
                    error={fieldErrors.model}
                />

                <LabeledInput
                    label={"Rendszám"}
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    error={fieldErrors.plate}
                />

                <HrOptional />

                <LabeledInput
                    label={"Km óra állás"}
                    value={odometerKm}
                    onChange={(e) => setOdometerKm(e.target.value)}
                />
                <LabeledInput
                    label={"Átlagfogyasztás"}
                    value={averageCons}
                    onChange={(e) => setAverageCons(e.target.value)}
                />
            </Modal>

            {error && <ErrorModal title={"Hiba!"} description={error} onClose={() => setError("")} />}
        </>
    );
}