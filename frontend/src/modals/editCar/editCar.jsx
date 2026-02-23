import { useEffect, useState } from "react";
import { editCar } from "../../actions/cars/carsActions";
import Button from "../../components/button/button";
import HrOptional from "../../components/hr-optional/hrOptional";
import LabeledInput from "../../components/labeledInput/labeledInput";
import Modal from "../../components/modal/modal";
import ErrorModal from "../../components/error-modal/errorModal";
import { clampNumberInput, limitTextLength } from "../../actions/shared/inputValidation";
import "./editCar.css";

export default function EditCar({ onClose, onSave, selectedCar }) {
  const LICENSE_PLATE_PATTERN = /^[A-Z]{3,4}-[0-9]{3}$/;
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [averageCons, setAverageCons] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!selectedCar) return;

    setBrandId(selectedCar.brand || "");
    setModelId(selectedCar.model || "");
    setLicensePlate(selectedCar.license_plate || "");
    setAverageCons(
      selectedCar.average_consumption === null || selectedCar.average_consumption === undefined
        ? ""
        : String(selectedCar.average_consumption)
    );
  }, [selectedCar]);

  async function handleEditCar() {
    setError("");
    setFieldErrors({});

    const tempErrors = {};
    if (!brandId) tempErrors.brand = "A márka megadása kötelező!";
    if (!modelId) tempErrors.model = "A modell megadása kötelező!";
    if (!licensePlate) tempErrors.plate = "A rendszám megadása kötelező!";
    if (licensePlate && !LICENSE_PLATE_PATTERN.test(licensePlate)) {
      tempErrors.plate = "Elfogadott formátumok: ABC-123 ABCD-123";
    }
    if (averageCons && (Number(averageCons) <= 0 || Number(averageCons) >= 100)) {
      tempErrors.averageCons = "Az átlagfogyasztás 0-nál nagyobb és 100-nál kisebb legyen.";
    }

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
          maxLength={25}
          onChange={(e) => setBrandId(limitTextLength(e.target.value, 25))}
          error={fieldErrors.brand}
          placeholder={"pl. Suzuki"}
        />

        <LabeledInput
          label={"Modell"}
          value={modelId}
          maxLength={25}
          onChange={(e) => setModelId(limitTextLength(e.target.value, 25))}
          error={fieldErrors.model}
          placeholder={"pl. Swift"}
        />

        <LabeledInput
          label={"Rendszám"}
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
          error={fieldErrors.plate}
          placeholder={"pl. ABC-123 vagy ABCD-123"}
          pattern={"^[A-Z]{3,4}-[0-9]{3}$"}
          title={"Formátum: ABC-123 vagy ABCD-123"}
          maxLength={8}
        />

        <HrOptional />

        <LabeledInput
          label={"Átlagfogyasztás"}
          value={averageCons}
          type={"number"}
          min={0.01}
          max={99.99}
          step={0.01}
          onChange={(e) => {
            setAverageCons(clampNumberInput(e.target.value, { min: 0.01, max: 99.99, decimals: 2 }));
            if (fieldErrors.averageCons) setFieldErrors((prev) => ({ ...prev, averageCons: "" }));
          }}
          error={fieldErrors.averageCons}
          placeholder={"pl. 6.5"}
        />
      </Modal>

      {error && <ErrorModal title={"Hiba!"} description={error} onClose={() => setError("")} />}
    </>
  );
}
