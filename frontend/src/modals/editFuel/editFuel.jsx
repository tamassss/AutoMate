import { useEffect, useState } from "react";
import Button from "../../components/button/button";
import LabeledInput from "../../components/labeledInput/labeledInput";
import Modal from "../../components/modal/modal";
import ErrorModal from "../../components/error-modal/errorModal";
import { editFuel } from "../../actions/fuelings/fuelingActions";
import { clampNumberInput } from "../../actions/shared/inputValidation";
import "./editFuel.css";

export default function EditFuel({ onClose, onSave, selectedFuel }) {
  const [liters, setLiters] = useState("");
  const [pricePerLiter, setPricePerLiter] = useState("");
  const [odometerKm, setOdometerKm] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!selectedFuel) return;
    setLiters(selectedFuel.mennyiseg ? String(selectedFuel.mennyiseg) : "");
    setPricePerLiter(selectedFuel.literft ? String(selectedFuel.literft) : "");
    setOdometerKm(selectedFuel.kmallas && selectedFuel.kmallas !== "-" ? String(selectedFuel.kmallas) : "");
  }, [selectedFuel]);

  async function handleSave() {
    if (!selectedFuel?.id) {
      setError("Hiányzik a tankolás azonosítója.");
      return;
    }

    setFieldErrors({});

    const tempErrors = {};
    if (!liters) tempErrors.liters = "A mennyiség megadása kötelező.";
    if (!pricePerLiter) tempErrors.pricePerLiter = "A Ft/liter megadása kötelező.";
    if (!odometerKm) tempErrors.odometerKm = "A km óra állás megadása kötelező.";

    const parsedLiters = Number(liters);
    const parsedPrice = Number(pricePerLiter);
    const parsedOdometer = Number(odometerKm);

    if (!tempErrors.liters && (Number.isNaN(parsedLiters) || parsedLiters < 1 || parsedLiters > 100)) {
      tempErrors.liters = "A mennyiség 1 és 100 liter között lehet.";
    }
    if (!tempErrors.pricePerLiter && (Number.isNaN(parsedPrice) || parsedPrice < 1 || parsedPrice > 1000)) {
      tempErrors.pricePerLiter = "A Ft/liter érték 1 és 1000 között lehet.";
    }
    if (!tempErrors.odometerKm && (Number.isNaN(parsedOdometer) || parsedOdometer < 0 || parsedOdometer > 999999)) {
      tempErrors.odometerKm = "A km óra állás 0 és 999999 között lehet.";
    }

    if (Object.keys(tempErrors).length > 0) {
      setFieldErrors(tempErrors);
      return;
    }

    setError("");
    setIsSaving(true);
    try {
      const updatedFueling = await editFuel(selectedFuel.id, {
        liters: parsedLiters,
        price_per_liter: parsedPrice,
        odometer_km: parsedOdometer,
      });

      onSave?.({
        id: selectedFuel.id,
        mennyiseg: updatedFueling?.liters ?? parsedLiters,
        literft: updatedFueling?.price_per_liter ?? parsedPrice,
        kmallas: updatedFueling?.odometer_km ?? parsedOdometer,
      });

      onClose?.();
    } catch (err) {
      setError(err.message || "Nem sikerült módosítani a tankolást.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Modal
        title={"Tankolás módosítása"}
        columns={1}
        onClose={onClose}
        footer={<Button text={isSaving ? "Mentés..." : "Módosítás"} onClick={handleSave} />}
      >
        <LabeledInput
          label={"Mennyiség (liter)"}
          type={"number"}
          min={1}
          max={100}
          value={liters}
          onChange={(e) => {
            setLiters(clampNumberInput(e.target.value, { min: 1, max: 100, decimals: 2 }));
            if (fieldErrors.liters) setFieldErrors((prev) => ({ ...prev, liters: "" }));
          }}
          error={fieldErrors.liters}
        />
        <LabeledInput
          label={"Ft/liter"}
          type={"number"}
          min={1}
          max={1000}
          value={pricePerLiter}
          onChange={(e) => {
            setPricePerLiter(clampNumberInput(e.target.value, { min: 1, max: 1000, decimals: 2 }));
            if (fieldErrors.pricePerLiter) setFieldErrors((prev) => ({ ...prev, pricePerLiter: "" }));
          }}
          error={fieldErrors.pricePerLiter}
        />
        <LabeledInput
          label={"Km óra állás"}
          type={"number"}
          min={0}
          max={999999}
          value={odometerKm}
          onChange={(e) => {
            setOdometerKm(clampNumberInput(e.target.value, { min: 0, max: 999999, integer: true }));
            if (fieldErrors.odometerKm) setFieldErrors((prev) => ({ ...prev, odometerKm: "" }));
          }}
          error={fieldErrors.odometerKm}
        />
      </Modal>

      {error && <ErrorModal title={"Hiba!"} description={error} onClose={() => setError("")} />}
    </>
  );
}
