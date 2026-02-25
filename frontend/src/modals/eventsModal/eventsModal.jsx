import { useCallback, useEffect, useState } from "react";

import Button from "../../components/button/button";
import LabeledInput from "../../components/labeledInput/labeledInput";
import Loading from "../../components/loading/loading";
import Modal from "../../components/modal/modal";
import SuccessModal from "../../components/success-modal/successModal";
import { deleteEvent, getEvents, updateEvent } from "../../actions/serviceLog/serviceLogActions";

import "./eventsModal.css";

export default function EventsModal({ onClose, onChanged }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [fieldErrorsById, setFieldErrorsById] = useState({});
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");

  const loadEvents = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      const data = await getEvents();
      setEvents(
        data.map((event) => ({
          id: event.id,
          title: event.title || "",
          date: event.date ? String(event.date).slice(0, 10) : "",
          reminder: event.reminder || "",
        }))
      );
      setFieldErrorsById({});
    } catch (err) {
      setError(err.message || "Nem sikerült betölteni az eseményeket.");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEvents();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadEvents]);

  function updateEventField(eventId, key, value) {
    setEvents((prev) =>
      prev.map((item) => (item.id === eventId ? { ...item, [key]: value } : item))
    );

    setFieldErrorsById((prev) => {
      const next = { ...prev };
      if (next[eventId]?.[key]) {
        next[eventId] = { ...next[eventId], [key]: "" };
      }
      return next;
    });
  }

  function validateEvent(item) {
    const errors = {};

    if (!item.title.trim()) errors.title = "Az esemény neve kötelező.";
    if (!item.date) errors.date = "A dátum megadása kötelező.";

    return errors;
  }

  async function handleSave(eventId) {
    const current = events.find((item) => item.id === eventId);
    if (!current) return;

    const currentErrors = validateEvent(current);
    if (Object.keys(currentErrors).length > 0) {
      setFieldErrorsById((prev) => ({ ...prev, [eventId]: currentErrors }));
      return;
    }

    setError("");
    setActionLoadingId(eventId);

    try {
      await updateEvent(eventId, {
        partName: current.title.trim(),
        date: current.date,
        reminder: current.reminder,
      });

      setSuccessText("Esemény sikeresen módosítva");
      setShowSuccess(true);
      await loadEvents();
      onChanged?.();
    } catch (err) {
      setError(err.message || "Nem sikerült módosítani az eseményt.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDelete(eventId) {
    setError("");
    setActionLoadingId(eventId);

    try {
      await deleteEvent(eventId);
      setEvents((prev) => prev.filter((item) => item.id !== eventId));
      setFieldErrorsById((prev) => {
        const next = { ...prev };
        delete next[eventId];
        return next;
      });
      setSuccessText("Esemény sikeresen törölve");
      setShowSuccess(true);
      onChanged?.();
    } catch (err) {
      setError(err.message || "Nem sikerült törölni az eseményt.");
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <>
      <Modal title={"Események kezelése"} onClose={onClose} columns={1}>
        <div className="events-modal-wrap full-width">
          {isLoading && <Loading />}
          {!isLoading && error && <p className="text-danger m-0">{error}</p>}

          {!isLoading && !error && events.length === 0 && <p className="m-0">Még nincs felvett esemény.</p>}

          {!isLoading && !error && events.length > 0 && (
            <div className="events-modal-list">
              {events.map((event) => {
                const errors = fieldErrorsById[event.id] || {};
                const disabled = actionLoadingId === event.id;

                return (
                  <div key={event.id} className="events-modal-item">
                    <LabeledInput
                      label={"Esemény neve"}
                      type={"text"}
                      value={event.title}
                      onChange={(e) => updateEventField(event.id, "title", e.target.value)}
                      error={errors.title}
                    />

                    <LabeledInput
                      label={"Dátum"}
                      type={"date"}
                      value={event.date}
                      onChange={(e) => updateEventField(event.id, "date", e.target.value)}
                      error={errors.date}
                    />

                    <LabeledInput
                      label={"Emlékeztető"}
                      type={"text"}
                      value={event.reminder}
                      onChange={(e) => updateEventField(event.id, "reminder", e.target.value)}
                    />

                    <div className="events-modal-actions">
                      <Button
                        text={disabled ? "Mentés..." : "Mentés"}
                        type={"button"}
                        onClick={() => handleSave(event.id)}
                        disabled={disabled}
                      />
                      <Button
                        text={disabled ? "Törlés..." : "Törlés"}
                        type={"button"}
                        onClick={() => handleDelete(event.id)}
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