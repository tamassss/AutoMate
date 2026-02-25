import { useState } from "react";
import Button from "../../components/button/button";
import Modal from "../../components/modal/modal";
import SuccessModal from "../../components/success-modal/successModal";
import { deleteFuel } from "../../actions/fuelings/fuelingActions";

export default function DeleteFuel({ onClose, onDeleted, fuelingId, datum }) {
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [deletedId, setDeletedId] = useState(null);

  async function handleDelete() {
    setError("");
    setIsDeleting(true);
    try {
      await deleteFuel(fuelingId);
      setDeletedId(fuelingId);
      setShowSuccess(true);
    } catch (err) {
      setError(err.message || "Nem sikerült törölni a tankolást.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Modal columns={1} onClose={onClose} title={"Biztosan törlöd?"}>
        <p className="full-width">
          <span className="gas-station-location">{datum}</span> tankolás törlése
        </p>

        <Button text={isDeleting ? "Törlés..." : "Törlés"} className="mt-5" onClick={handleDelete} />
        {error && <p className="text-danger full-width">{error}</p>}
      </Modal>

      {showSuccess && (
        <SuccessModal
          description="Tankolás törölve"
          onClose={() => {
            setShowSuccess(false);
            if (deletedId !== null) onDeleted?.(deletedId);
            onClose?.();
          }}
        />
      )}
    </>
  );
}
