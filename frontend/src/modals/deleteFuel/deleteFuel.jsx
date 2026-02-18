import { useState } from "react";
import Button from "../../components/button/button";
import Modal from "../../components/modal/modal";
import { deleteFuel } from "../../actions/fuelings/fuelingActions";
import "./deleteFuuel.css";

export default function DeleteFuel({ onClose, onDeleted, fuelingId, datum }) {
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setError("");
    setIsDeleting(true);
    try {
      await deleteFuel(fuelingId);
      onDeleted?.(fuelingId);
      onClose?.();
    } catch (err) {
      setError(err.message || "Nem sikerült törölni a tankolást.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal columns={1} onClose={onClose} title={"Biztosan törlöd?"}>
      <p className="full-width">
        <span className="gas-station-location">{datum}</span> tankolás törlése
      </p>

      <Button
        text={isDeleting ? "Törlés..." : "Törlés"}
        className="mt-5"
        onClick={handleDelete}
      />
      {error && <p className="text-danger full-width">{error}</p>}
    </Modal>
  );
}

