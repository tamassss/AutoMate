import { useState } from "react";
import Button from "../../components/button/button";
import Modal from "../../components/modal/modal";
import SuccessModal from "../../components/success-modal/successModal";
import { deleteGasStation } from "../../actions/gasStations/gasStationActions";
import "./deleteGasStation.css";

export default function DeleteGasStation({ onClose, onDeleted, gasStationId, helyseg, cim }) {
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleDelete() {
    setError("");
    setIsDeleting(true);
    try {
      await deleteGasStation(gasStationId);
      setShowSuccess(true);
    } catch (err) {
      setError(err.message || "Nem sikerült törölni a benzinkutat.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Modal columns={1} onClose={onClose} title={"Biztosan törlöd?"}>
        <p className="full-width">
          <span className="gas-station-location">{helyseg} {cim}</span> benzinkut torlese
        </p>

        <Button text={isDeleting ? "Törlés..." : "Törlés"} className="mt-5" onClick={handleDelete} />
        {error && <p className="text-danger full-width">{error}</p>}
      </Modal>

      {showSuccess && (
        <SuccessModal
          description="Benzinkút törölve"
          onClose={() => {
            setShowSuccess(false);
            onDeleted?.(gasStationId);
            onClose?.();
          }}
        />
      )}
    </>
  );
}
