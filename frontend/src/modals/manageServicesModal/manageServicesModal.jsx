import { useCallback, useEffect, useState } from "react";

import Button from "../../components/button/button";
import LabeledInput from "../../components/labeledInput/labeledInput";
import Loading from "../../components/loading/loading";
import Modal from "../../components/modal/modal";
import SuccessModal from "../../components/success-modal/successModal";
import {
  deleteServiceLogEntry,
  getServiceLog,
  updateServiceLogEntry,
} from "../../actions/serviceLog/serviceLogActions";

import "./manageServicesModal.css";

function parseReminder(reminder) {
  const text = String(reminder || "").trim();

  if (!text || text === "-") {
    return { reminderDate: "", reminderKm: "" };
  }

  if (text.includes("|")) {
    const parts = text.split("|");
    const reminderDate = (parts[0] || "").trim();
    const reminderKm = (parts[1] || "").trim().replace(" km", "");
    return { reminderDate, reminderKm };
  }

  if (text.includes("-")) {
    return { reminderDate: text, reminderKm: "" };
  }

  return { reminderDate: "", reminderKm: text.replace(" km", "") };
}

export default function ManageServicesModal({ onClose, onChanged }) {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [fieldErrorsById, setFieldErrorsById] = useState({});
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");

  const loadServices = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      const data = await getServiceLog();
      setServices(
        data.map((service) => {
          const parsed = parseReminder(service.rawReminder || service.emlekeztetoDatum);
          return {
            id: service.id,
            partName: service.alkatresz === "-" ? "" : service.alkatresz,
            date: service.rawDate ? String(service.rawDate).slice(0, 10) : "",
            cost: service.rawCost == null ? "" : String(service.rawCost),
            reminderDate: parsed.reminderDate,
            reminderKm: parsed.reminderKm,
          };
        })
      );
      setFieldErrorsById({});
    } catch (err) {
      setError(err.message || "Nem sikerült betölteni a szervizeket.");
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadServices();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadServices]);

  function updateServiceField(serviceId, key, value) {
    setServices((prev) =>
      prev.map((item) => (item.id === serviceId ? { ...item, [key]: value } : item))
    );

    setFieldErrorsById((prev) => {
      const next = { ...prev };
      if (next[serviceId]?.[key]) {
        next[serviceId] = { ...next[serviceId], [key]: "" };
      }
      return next;
    });
  }

  function validateService(item) {
    const errors = {};

    if (!item.partName.trim()) errors.partName = "Az alkatrész megadása kötelező.";
    if (!item.date) errors.date = "A dátum megadása kötelező.";

    if (item.cost !== "") {
      const numericCost = Number(item.cost);
      if (Number.isNaN(numericCost) || numericCost < 0 || numericCost > 999999999) {
        errors.cost = "Az ár 0 és 999999999 között lehet.";
      }
    }

    if (item.reminderKm !== "") {
      const numericKm = Number(item.reminderKm);
      if (Number.isNaN(numericKm) || numericKm < 0 || numericKm > 999999) {
        errors.reminderKm = "A km érték 0 és 999999 között lehet.";
      }
    }

    return errors;
  }

  async function handleSave(serviceId) {
    const current = services.find((item) => item.id === serviceId);
    if (!current) return;

    const currentErrors = validateService(current);
    if (Object.keys(currentErrors).length > 0) {
      setFieldErrorsById((prev) => ({ ...prev, [serviceId]: currentErrors }));
      return;
    }

    setError("");
    setActionLoadingId(serviceId);

    try {
      await updateServiceLogEntry(serviceId, {
        partName: current.partName.trim(),
        date: current.date,
        cost: current.cost,
        reminderDate: current.reminderDate,
        reminderKm: current.reminderKm,
      });

      setSuccessText("Szerviz sikeresen módosítva");
      setShowSuccess(true);
      await loadServices();
      onChanged?.();
    } catch (err) {
      setError(err.message || "Nem sikerült módosítani a szervizt.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDelete(serviceId) {
    setError("");
    setActionLoadingId(serviceId);

    try {
      await deleteServiceLogEntry(serviceId);
      setServices((prev) => prev.filter((item) => item.id !== serviceId));
      setFieldErrorsById((prev) => {
        const next = { ...prev };
        delete next[serviceId];
        return next;
      });
      setSuccessText("Szerviz sikeresen törölve");
      setShowSuccess(true);
      onChanged?.();
    } catch (err) {
      setError(err.message || "Nem sikerült törölni a szervizt.");
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <>
      <Modal title={"Szervizek kezelése"} onClose={onClose} columns={1}>
        <div className="manage-services-wrap full-width">
          {isLoading && <Loading />}
          {!isLoading && error && <p className="text-danger m-0">{error}</p>}

          {!isLoading && !error && services.length === 0 && <p className="m-0">Még nincs felvett szerviz.</p>}

          {!isLoading && !error && services.length > 0 && (
            <div className="manage-services-list">
              {services.map((service) => {
                const errors = fieldErrorsById[service.id] || {};
                const disabled = actionLoadingId === service.id;

                return (
                  <div key={service.id} className="manage-services-item">
                    <LabeledInput
                      label={"Alkatrész"}
                      type={"text"}
                      value={service.partName}
                      onChange={(e) => updateServiceField(service.id, "partName", e.target.value)}
                      error={errors.partName}
                    />

                    <LabeledInput
                      label={"Csere ideje"}
                      type={"date"}
                      value={service.date}
                      onChange={(e) => updateServiceField(service.id, "date", e.target.value)}
                      error={errors.date}
                    />

                    <LabeledInput
                      label={"Ár"}
                      type={"number"}
                      min={0}
                      max={999999999}
                      value={service.cost}
                      onChange={(e) => updateServiceField(service.id, "cost", e.target.value)}
                      error={errors.cost}
                    />

                    <LabeledInput
                      label={"Emlékeztető dátum"}
                      type={"date"}
                      value={service.reminderDate}
                      onChange={(e) => updateServiceField(service.id, "reminderDate", e.target.value)}
                    />

                    <LabeledInput
                      label={"Emlékeztető km"}
                      type={"number"}
                      min={0}
                      max={999999}
                      value={service.reminderKm}
                      onChange={(e) => updateServiceField(service.id, "reminderKm", e.target.value)}
                      error={errors.reminderKm}
                    />

                    <div className="manage-services-actions">
                      <Button
                        text={disabled ? "Mentés..." : "Mentés"}
                        type={"button"}
                        onClick={() => handleSave(service.id)}
                        disabled={disabled}
                      />
                      <Button
                        text={disabled ? "Törlés..." : "Törlés"}
                        type={"button"}
                        onClick={() => handleDelete(service.id)}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Modal>

      {showSuccess && (
        <SuccessModal
          description={successText}
          onClose={() => {
            setShowSuccess(false);
            setSuccessText("");
          }}
        />
      )}
    </>
  );
}