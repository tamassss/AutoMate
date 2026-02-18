import { useState } from "react";
import { createCar } from "../../actions/cars/carsActions";
import Button from "../../components/button/button";
import HrOptional from "../../components/hr-optional/hrOptional";
import LabeledInput from "../../components/labeledInput/labeledInput";
import Modal from "../../components/modal/modal";
import ErrorModal from "../../components/error-modal/errorModal";
import "./addCar.css";

export default function AddCar({ onClose, onSave }) {
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [averageCons, setAverageCons] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleCreateCar() {
    setError("");
    setFieldErrors({});

    const tempErrors = {};
    if (!brandId) tempErrors.brand = "A márka megadása kötelező!";
    if (!modelId) tempErrors.model = "A modell megadása kötelező!";
    if (!licensePlate) tempErrors.plate = "A rendszám megadása kötelező!";

    if (Object.keys(tempErrors).length > 0) {
      setFieldErrors(tempErrors);
      return;
    }

    setIsSaving(true);
    try {
      await createCar({
        license_plate: licensePlate,
        brand: brandId,
        model: modelId,
        average_consumption: averageCons,
      });

      onSave?.();
    } catch (err) {
      setError(err.message || "Nem sikerült létrehozni az autót");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Modal
        title="Autó hozzáadása"
        columns={1}
        onClose={onClose}
        footer={<Button text={isSaving ? "Mentés..." : "Hozzáadás"} onClick={handleCreateCar} />}
      >
        <LabeledInput
          label={"Márka"}
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          error={fieldErrors.brand}
          placeholder={"pl. Suzuki"}
        />

        <LabeledInput
          label={"Modell"}
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
          error={fieldErrors.model}
          placeholder={"pl. Swift"}
        />

        <LabeledInput
          label={"Rendszám"}
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
          error={fieldErrors.plate}
          placeholder={"pl. ABC-123"}
        />

        <HrOptional />

        <LabeledInput
          label={"Átlagfogyasztás"}
          value={averageCons}
          onChange={(e) => setAverageCons(e.target.value)}
          placeholder={"pl. 6.5"}
        />
      </Modal>

      {error && <ErrorModal title={"Hiba!"} description={error} />}
    </>
  );
}
