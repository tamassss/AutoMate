import { useEffect, useState } from "react";
import Button from "../../components/button/button";
import LabeledInput from "../../components/labeledInput/labeledInput";
import Modal from "../../components/modal/modal";
import ErrorModal from "../../components/error-modal/errorModal";
import { editFuelingById, editGasStation } from "../../actions/gasStations/gasStationActions";
import "./editGasStation.css";

export default function EditGasStation({ onClose, onSave, selectedStation }) {
  const FUEL_OPTIONS = [
    { value: "1", label: "95 benzin" },
    { value: "2", label: "100 benzin" },
    { value: "3", label: "Dízel" },
    { value: "4", label: "Dízel Plus" },
  ];

  const [pricePerLiter, setPricePerLiter] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [supplier, setSupplier] = useState("");
  const [fuelTypeId, setFuelTypeId] = useState("1");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!selectedStation) return;
    setPricePerLiter(selectedStation.literft ? String(selectedStation.literft) : "");
    setCity(selectedStation.stationCity || "");
    setAddress(selectedStation.cim && selectedStation.cim !== "-" ? selectedStation.cim : "");
    setSupplier(selectedStation.supplier || "");
    setFuelTypeId(selectedStation.fuelTypeId ? String(selectedStation.fuelTypeId) : "1");
  }, [selectedStation]);

  async function handleSave() {
    if (!selectedStation?.gasStationId || !selectedStation?.fuelingId) {
      setError("Hiányzik az azonosító.");
      return;
    }

    if (!pricePerLiter || !city || !address || !supplier || !fuelTypeId) {
      setError("A Ft/liter, helység, cím, forgalmazó és üzemanyag típusa mezők kötelezők.");
      return;
    }

    const parsedPrice = Number(pricePerLiter);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("A Ft/liter mezőbe érvényes, 0-nál nagyobb számot adj meg.");
      return;
    }

    setError("");
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
      onClose?.();
    } catch (err) {
      setError(err.message || "Nem sikerült módosítani a benzinkutat.");
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
        footer={<Button text={isSaving ? "Mentés..." : "Módosítás"} onClick={handleSave} />}
      >
        <LabeledInput label={"Ft/liter"} type={"number"} value={pricePerLiter} onChange={(e) => setPricePerLiter(e.target.value)} />
        <LabeledInput label={"Helység"} value={city} onChange={(e) => setCity(e.target.value)} />
        <LabeledInput label={"Cím"} value={address} onChange={(e) => setAddress(e.target.value)} />
        <LabeledInput label={"Forgalmazó"} value={supplier} onChange={(e) => setSupplier(e.target.value)} />
        <div className="full-width text-start">
          <label style={{ display: "block", marginBottom: "6px" }}>Üzemanyag típusa</label>
          <select
            value={fuelTypeId}
            onChange={(e) => setFuelTypeId(e.target.value)}
            style={{ width: "100%", padding: "12px", borderRadius: "8px" }}
          >
            {FUEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </Modal>
      {error && <ErrorModal title={"Hiba!"} description={error} onClose={() => setError("")} />}
    </>
  );
}

