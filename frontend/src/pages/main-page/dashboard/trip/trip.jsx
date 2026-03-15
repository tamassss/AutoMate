import { useEffect, useMemo, useState } from "react";
import Button from "../../../../components/button/button";
import { formatGroupedNumber, formatHmsFromSeconds, formatMoney, hhmmToMinutes } from "../../../../actions/shared/formatters";
import "./trip.css";

// eltelt idő segédfüggvény
function getElapsed(runtime) {
  const before = Number(runtime?.elapsedBeforeRunSec || 0);
  if (!runtime?.isRunning || !runtime?.lastStartedAtMs) return before;

  const live = Math.max(0, Math.floor((Date.now() - Number(runtime.lastStartedAtMs)) / 1000));
  return before + live;
}

// javítás/rontás kiszámolás
function getArrivalDelta(expected, actual) {
  if (!expected || !actual || expected === "-" || actual === "-") return null;

  const expectedMinutes = hhmmToMinutes(expected);
  const actualMinutes = hhmmToMinutes(actual);
  if (expectedMinutes == null || actualMinutes == null) return null;

  return expectedMinutes - actualMinutes;
}

export default function Trip({ tripData, onCancelFinish, onSaveFinish, onRuntimeChange }) {
  const [runtime, setRuntime] = useState(() => {
    return (
      tripData?.runtime || {
        isRunning: true,
        elapsedBeforeRunSec: 0,
        lastStartedAtMs: Date.now(),
        showFinishResult: false,
        actualArrival: null,
      }
    );
  });

  const [, setTick] = useState(0);

  // stopper mp
  useEffect(() => {
    if (!runtime?.isRunning || runtime?.showFinishResult) return;

    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [runtime?.isRunning, runtime?.showFinishResult]);

  useEffect(() => {
    onRuntimeChange?.(runtime);
  }, [runtime, onRuntimeChange]);

  useEffect(() => {
    if (tripData?.runtime) {
      setRuntime(tripData.runtime);
    }
  }, [tripData?.runtime]);

  const elapsedSeconds = getElapsed(runtime);
  const distanceKm = Number(tripData?.distanceKm || 0);
  const avgConsumption = Number(tripData?.avgConsumption || 0);
  const calculatedLiters = avgConsumption > 0 ? (distanceKm * avgConsumption) / 100 : 0;

  const fuelings = tripData?.fuelings || [];
  const fueledLiters = fuelings.reduce((sum, f) => sum + Number(f.liters || 0), 0);
  const fueledSpent = fuelings.reduce((sum, f) => sum + Number(f.spent || 0), 0);

  // Összesített adatok a mentéshez
  const finalData = useMemo(() => {
    return {
      elapsed: formatHmsFromSeconds(elapsedSeconds),
      distanceKm: distanceKm.toFixed(1),
      expectedConsumption: calculatedLiters.toFixed(2),
      fueledLiters: fueledLiters.toFixed(2),
      fueledSpent: fueledSpent.toFixed(0),
      totalConsumptionEstimate: (calculatedLiters + fueledLiters).toFixed(2),
      refuelCount: fuelings.length,
      runtime,
    };
  }, [elapsedSeconds, distanceKm, calculatedLiters, fueledLiters, fueledSpent, fuelings.length, runtime]);

  //Szünet
  function handlePause() {
    if (runtime.isRunning) {
      setRuntime((prev) => ({
        ...prev,
        isRunning: false,
        elapsedBeforeRunSec: getElapsed(prev),
        lastStartedAtMs: null,
      }));
    } else {
      setRuntime((prev) => ({
        ...prev,
        isRunning: true,
        lastStartedAtMs: Date.now(),
      }));
    }
  }

  //Vége
  function handleFinish() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    setRuntime((prev) => ({
      ...prev,
      isRunning: false,
      elapsedBeforeRunSec: getElapsed(prev),
      lastStartedAtMs: null,
      showFinishResult: true,
      actualArrival: `${hh}:${mm}`,
    }));
  }

  const arrivalDelta = getArrivalDelta(tripData?.expectedArrival, runtime?.actualArrival);
  
  // javítás/rontás
  const arrivalDeltaText =
    arrivalDelta === null ? "" : arrivalDelta >= 0 ? ` (+${arrivalDelta} perc)` : ` (-${Math.abs(arrivalDelta)} perc)`;

  const arrivalDeltaStyle = {
    color: arrivalDelta === null ? "#fff" : arrivalDelta >= 0 ? "#44d062" : "#e35b5b",
    fontWeight: "bold",
    marginLeft: "6px",
  };

  return (
    <div className="ongoing-trip-container mt-1">
      <h2 style={{ color: "#4a9fff" }} className="trip-title">{tripData?.title || "-"}</h2>

      <table className="trip-table">
        <tbody>
          <tr>
            <td className="odd field">Indulás</td>
            <td className="odd field">{tripData?.startTime || "-"}</td>
          </tr>
          <tr>
            <td className="even field">Várható érkezés</td>
            <td className="even field">
              {tripData?.expectedArrival || "-"}
              {runtime?.showFinishResult && arrivalDelta !== null && (
                <span style={arrivalDeltaStyle}>{arrivalDeltaText}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="odd field">Út hossza</td>
            <td className="odd field">
              {distanceKm ? `${formatGroupedNumber(distanceKm, { decimals: 1, trimTrailingZeros: true })} km` : "-"}
            </td>
          </tr>
          <tr>
            <td className="even field">Várható fogyasztás</td>
            <td className="even field">
              {calculatedLiters ? `${formatGroupedNumber(calculatedLiters, { decimals: 2, trimTrailingZeros: true })} l` : "-"}
            </td>
          </tr>
          <tr>
            <td className="odd field">Tankolások száma</td>
            <td className="odd field">{formatGroupedNumber(fuelings.length)}</td>
          </tr>
          <tr>
            <td className="even field">Tankolt mennyiség</td>
            <td className="even field">
              {`${formatGroupedNumber(fueledLiters, { decimals: 2, trimTrailingZeros: true })} l`}
            </td>
          </tr>
          <tr>
            <td className="odd field">Elköltött pénz</td>
            <td className="odd field">{formatMoney(fueledSpent)}</td>
          </tr>
        </tbody>
      </table>

      <div className="trip-timer mt-1">{formatHmsFromSeconds(elapsedSeconds)}</div>

      {!runtime?.showFinishResult ? (
        <div className="trip-controls">
          <Button 
            className="btn-pause" 
            text={runtime?.isRunning ? "Szünet" : "Folytatás"} 
            onClick={handlePause} 
          />
          <Button 
            className="btn-finish" 
            text="Út vége" 
            onClick={handleFinish} 
          />
        </div>
      ) : (
        <div className="trip-controls">
          <Button text="Törlés" onClick={onCancelFinish} />
          <Button text="Mentés" onClick={() => onSaveFinish?.(finalData)} />
        </div>
      )}
    </div>
  );
}