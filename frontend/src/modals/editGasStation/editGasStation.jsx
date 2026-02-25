import { useEffect, useState } from "react";
import Button from "../../components/button/button";
import LabeledInput from "../../components/labeledInput/labeledInput";
import Modal from "../../components/modal/modal";
import ErrorModal from "../../components/error-modal/errorModal";
import SuccessModal from "../../components/success-modal/successModal";
import { editFuelingById, editGasStation } from "../../actions/gasStations/gasStationActions";
import { clampNumberInput, limitTextLength } from "../../actions/shared/inputValidation";
import "./editGasStation.css";

export default function EditGasStation({ onClose, onSave, selectedStation }) {
  const FUEL_OPTIONS = [
    { value: "1", label: "95 benzin" },
    { value: "2", label: "100 benzin" },
    { value: "3", label: "Dízel" },
    { value: "4", label: "Dízel Plus" },
  ];
  const SUPPLIER_OPTIONS = ["Auchan", "ORLEN", "MOL", "SHELL"];

  const [pricePerLiter, setPricePerLiter] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [supplier, setSupplier] = useState("");
  const [fuelTypeId, setFuelTypeId] = useState("1");
  const [localError, setLocalError] = useState("");
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!selectedStation) return;
    setPricePerLiter(selectedStation.literft ? String(selectedStation.literft) : "");
    setCity(selectedStation.stationCity || "");
    setAddress(selectedStation.cim && selectedStation.cim !== "-" ? selectedStation.cim : "");
    setSupplier(selectedStation.supplier || "");
    setFuelTypeId(selectedStation.fuelTypeId ? String(selectedStation.fuelTypeId) : "1");
  }, [selectedStation]);

  async function handleSave(e) {
    e.preventDefault();
    if (!selectedStation?.gasStationId || !selectedStation?.fuelingId) {
      setLocalError("Hiányzik az azonosító.");
      return;
    }

    setLocalError("");
    setServerError("");
    setFieldErrors({});

    const tempErrors = {};
    if (!pricePerLiter || !city || !address || !supplier || !fuelTypeId) {
      if (!pricePerLiter) tempErrors.pricePerLiter = "A Ft/liter megadása kötelező.";
      if (!city) tempErrors.city = "A helység megadása kötelező.";
      if (!address) tempErrors.address = "A cím megadása kötelező.";
      if (!supplier) tempErrors.supplier = "A forgalmazó megadása kötelező.";
      if (!fuelTypeId) tempErrors.fuelTypeId = "Az üzemanyag típusa kötelező.";
    }

    const parsedPrice = Number(pricePerLiter);
    if (!tempErrors.pricePerLiter && (Number.isNaN(parsedPrice) || parsedPrice < 1 || parsedPrice > 100)) {
      tempErrors.pricePerLiter = "A Ft/liter érték 1 és 100 között lehet.";
    }

    if (Object.keys(tempErrors).length > 0) {
      setFieldErrors(tempErrors);
      return;
    }

    setIsSaving(true);
    try {
      await editGasStation(selectedStation.gasStationId, {
        name: selectedStation.stationName || null,
        city,
        postal_code: selectedStation.stationPostalCode || null,
        street: address,
        house_number: null,
      });

      const updatedFueling = await editFuelingById(selectedStation.fuelingId, {
        price_per_liter: parsedPrice,
        supplier,
        fuel_type_id: Number(fuelTypeId),
      });

      const selectedFuelType = FUEL_OPTIONS.find((opt) => opt.value === String(fuelTypeId));

      onSave?.({
        gasStationId: selectedStation.gasStationId,
        fuelingId: selectedStation.fuelingId,
        stationName: selectedStation.stationName || "",
        stationCity: city,
        stationPostalCode: selectedStation.stationPostalCode || "",
        stationStreet: address,
        stationHouseNumber: "",
        literft: updatedFueling?.price_per_liter ?? parsedPrice,
        supplier: updatedFueling?.supplier ?? supplier,
        fuelTypeId: updatedFueling?.fuel_type_id ?? Number(fuelTypeId),
        fuelType: updatedFueling?.fuel_type || selectedFuelType?.label || "-",
      });
      setShowSuccess(true);
    } catch (err) {
      setServerError(err.message || "Nem sikerült módosítani a benzinkutat.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Modal
        title={"Benzinkút módosítása"}
        columns={1}
        onClose={onClose}
        onSubmit={handleSave}
        footer={<Button text={isSaving ? "Mentés..." : "Módosítás"} type={"submit"} />}
      >
        <LabeledInput
          label={"Ft/liter"}
          type={"number"}
          min={1}
          max={100}
          value={pricePerLiter}
          onChange={(e) => {
            setPricePerLiter(clampNumberInput(e.target.value, { min: 1, max: 100, decimals: 2 }));
            if (fieldErrors.pricePerLiter) setFieldErrors((prev) => ({ ...prev, pricePerLiter: "" }));
          }}
          error={fieldErrors.pricePerLiter}
        />
        <LabeledInput
          label={"Helység"}
          maxLength={20}
          value={city}
          onChange={(e) => {
            setCity(limitTextLength(e.target.value, 20));
            if (fieldErrors.city) setFieldErrors((prev) => ({ ...prev, city: "" }));
          }}
          error={fieldErrors.city}
        />
        <LabeledInput
          label={"Cím"}
          maxLength={20}
          value={address}
          onChange={(e) => {
            setAddress(limitTextLength(e.target.value, 20));
            if (fieldErrors.address) setFieldErrors((prev) => ({ ...prev, address: "" }));
          }}
          error={fieldErrors.address}
        />
        <div className="full-width text-start modal-select-group">
          <label className="modal-select-label">Forgalmazó</label>
          <select
            value={supplier}
            onChange={(e) => {
              setSupplier(e.target.value);
              if (fieldErrors.supplier) setFieldErrors((prev) => ({ ...prev, supplier: "" }));
            }}
            className="modal-select"
          >
            {SUPPLIER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {fieldErrors.supplier && <span className="error-message">{fieldErrors.supplier}</span>}
        </div>
        <div className="full-width text-start modal-select-group">
          <label className="modal-select-label">Üzemanyag típusa</label>
          <select
            value={fuelTypeId}
            onChange={(e) => {
              setFuelTypeId(e.target.value);
              if (fieldErrors.fuelTypeId) setFieldErrors((prev) => ({ ...prev, fuelTypeId: "" }));
            }}
            className="modal-select"
          >
            {FUEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {fieldErrors.fuelTypeId && <span className="error-message">{fieldErrors.fuelTypeId}</span>}
        </div>
        {localError && <p className="text-danger m-0">{localError}</p>}
      </Modal>
      {serverError && <ErrorModal title={"Hiba!"} description={serverError} onClose={() => setServerError("")} />}
      {showSuccess && (
        <SuccessModal
          description="Benzinkút sikeresen módosítva"
          onClose={() => {
            setShowSuccess(false);
            onClose?.();
          }}
        />
      )}
    </>
  );
}

