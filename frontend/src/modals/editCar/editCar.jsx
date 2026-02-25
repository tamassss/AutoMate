import { useEffect, useState } from "react";
import { editCar } from "../../actions/cars/carsActions";
import Button from "../../components/button/button";
import HrOptional from "../../components/hr-optional/hrOptional";
import LabeledInput from "../../components/labeledInput/labeledInput";
import Modal from "../../components/modal/modal";
import ErrorModal from "../../components/error-modal/errorModal";
import SuccessModal from "../../components/success-modal/successModal";
import CarImageSelectModal from "../carImageSelectModal/carImageSelectModal";
import { DEFAULT_CAR_IMAGE_ID, DEFAULT_CAR_IMAGE_SRC, getCarImageSrc } from "../../assets/car-images/carImageOptions";
import { clampNumberInput, limitTextLength } from "../../actions/shared/inputValidation";
import "../../components/car-image-picker/carImagePicker.css";
import "./editCar.css";

export default function EditCar({ onClose, onSave, selectedCar }) {
  const LICENSE_PLATE_PATTERN = /^[A-Z]{3,4}-[0-9]{3}$/;
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [averageCons, setAverageCons] = useState("");
  const [carImage, setCarImage] = useState(DEFAULT_CAR_IMAGE_ID);
  const [showImageSelect, setShowImageSelect] = useState(false);
  const [localError, setLocalError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  function isDuplicatePlateError(message = "") {
    return String(message).toLowerCase().includes("rendszám már regisztrálva van");
  }

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
    setCarImage(selectedCar.car_image || DEFAULT_CAR_IMAGE_ID);
  }, [selectedCar]);

  async function handleEditCar(e) {
    e.preventDefault();
    setLocalError("");
    setServerError("");
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
      setLocalError("Nincs kiválasztott autó.");
      return;
    }

    setIsSaving(true);
    try {
      await editCar(selectedCar.car_id, {
        license_plate: licensePlate,
        brand: brandId,
        model: modelId,
        average_consumption: averageCons,
        car_image: carImage,
      });
      onSave?.();
      setShowSuccess(true);
    } catch (err) {
      const message = err?.message || "Nem sikerült módosítani az autót";
      if (isDuplicatePlateError(message)) {
        setFieldErrors((prev) => ({ ...prev, plate: message }));
        setServerError("");
        return;
      }
      setServerError(message);
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
        onSubmit={handleEditCar}
        footer={<Button text={isSaving ? "Mentés..." : "Módosítás"} type={"submit"} />}
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
          onChange={(e) => {
            setLicensePlate(e.target.value.toUpperCase());
            if (fieldErrors.plate) setFieldErrors((prev) => ({ ...prev, plate: "" }));
          }}
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
        <div className="car-image-picker-wrap">
          <p className="car-image-picker-label">Autó kép</p>
          <button
            type="button"
            className="car-image-option is-active"
            onClick={() => setShowImageSelect(true)}
            title="Autó kép kiválasztása"
          >
            <img
              src={carImage === DEFAULT_CAR_IMAGE_ID ? DEFAULT_CAR_IMAGE_SRC : getCarImageSrc(carImage)}
              alt="Autó ikon"
              className="car-image-option-img"
            />
          </button>
        </div>
        {localError && <p className="text-danger m-0">{localError}</p>}
      </Modal>

      {serverError && <ErrorModal title={"Hiba!"} description={serverError} onClose={() => setServerError("")} />}
      {showSuccess && (
        <SuccessModal
          description="Sikeres módosítás"
          onClose={() => {
            setShowSuccess(false);
            onClose?.();
          }}
        />
      )}
      {showImageSelect && (
        <CarImageSelectModal
          selectedImageId={carImage}
          onSelect={setCarImage}
          onClose={() => setShowImageSelect(false)}
        />
      )}
    </>
  );
}
