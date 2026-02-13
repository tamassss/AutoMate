import { useEffect, useMemo, useState } from "react";
import Button from "../../../../components/button/button";
import "./trip.css";

function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}

function getElapsed(runtime) {
    const before = Number(runtime?.elapsedBeforeRunSec || 0);
    if (!runtime?.isRunning || !runtime?.lastStartedAtMs) {
        return before;
    }
    const live = Math.max(0, Math.floor((Date.now() - Number(runtime.lastStartedAtMs)) / 1000));
    return before + live;
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

    useEffect(() => {
        if (!runtime?.isRunning || runtime?.showFinishResult) return;
        const timer = setInterval(() => setTick((t) => t + 1), 1000);
        return () => clearInterval(timer);
    }, [runtime?.isRunning, runtime?.showFinishResult]);

    useEffect(() => {
        onRuntimeChange?.(runtime);
    }, [runtime, onRuntimeChange]);

    useEffect(() => {
        if (!tripData?.runtime) return;
        setRuntime(tripData.runtime);
    }, [tripData?.runtime]);

    const elapsedSeconds = getElapsed(runtime);

    const distanceKm = Number(tripData?.distanceKm || 0);
    const avgConsumption = Number(tripData?.avgConsumption || 0);
    const calculatedLiters = avgConsumption > 0 ? (distanceKm * avgConsumption) / 100 : 0;

    const fuelings = tripData?.fuelings || [];
    const fueledLiters = fuelings.reduce((sum, f) => sum + Number(f.liters || 0), 0);
    const fueledSpent = fuelings.reduce((sum, f) => sum + Number(f.spent || 0), 0);

    const finalData = useMemo(() => {
        return {
            elapsed: formatTime(elapsedSeconds),
            distanceKm: distanceKm.toFixed(1),
            expectedConsumption: calculatedLiters.toFixed(2),
            fueledLiters: fueledLiters.toFixed(2),
            fueledSpent: fueledSpent.toFixed(0),
            totalConsumptionEstimate: (calculatedLiters + fueledLiters).toFixed(2),
            refuelCount: fuelings.length,
            runtime,
        };
    }, [elapsedSeconds, distanceKm, calculatedLiters, fueledLiters, fueledSpent, fuelings.length, runtime]);

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

    function handleDelete() {
        onCancelFinish?.();
    }

    function handleSaveFinish() {
        onSaveFinish?.(finalData);
    }

    function getArrivalDelta(expected, actual) {
        if (!expected || !actual || expected === "-" || actual === "-") return null;
        const [eh, em] = expected.split(":").map(Number);
        const [ah, am] = actual.split(":").map(Number);
        if ([eh, em, ah, am].some((n) => Number.isNaN(n))) return null;
        return eh * 60 + em - (ah * 60 + am);
    }

    const actualArrival = runtime?.actualArrival;
    const showFinishResult = !!runtime?.showFinishResult;

    const arrivalDelta = getArrivalDelta(tripData?.expectedArrival, actualArrival);
    const arrivalDeltaText =
        arrivalDelta === null
            ? ""
            : arrivalDelta >= 0
            ? ` (+${arrivalDelta} perc)`
            : ` (-${Math.abs(arrivalDelta)} perc)`;
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
                        <td className="odd field">Indulas</td>
                        <td className="odd field">{tripData?.startTime || "-"}</td>
                    </tr>
                    <tr>
                        <td className="even field">Várható érkezés</td>
                        <td className="even field">
                            {tripData?.expectedArrival || "-"}
                            {showFinishResult && arrivalDelta !== null && (
                                <span style={arrivalDeltaStyle}>{arrivalDeltaText}</span>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="odd field">Ut hossza</td>
                        <td className="odd field">{distanceKm ? `${distanceKm.toFixed(1)} km` : "-"}</td>
                    </tr>
                    <tr>
                        <td className="even field">Várható fogyasztás</td>
                        <td className="even field">{calculatedLiters ? `${calculatedLiters.toFixed(2)} l` : "-"}</td>
                    </tr>
                    <tr>
                        <td className="odd field">Tankolások száma</td>
                        <td className="odd field">{fuelings.length}</td>
                    </tr>
                    <tr>
                        <td className="even field">Tankolt mennyiseg</td>
                        <td className="even field">{fueledLiters.toFixed(2)} l</td>
                    </tr>
                    <tr>
                        <td className="odd field">Elkoltott penz</td>
                        <td className="odd field">{fueledSpent.toFixed(0)} Ft</td>
                    </tr>
                </tbody>
            </table>

            <div className="trip-timer mt-1">{formatTime(elapsedSeconds)}</div>

            {!showFinishResult ? (
                <div className="trip-controls">
                    <Button
                        className="btn-pause"
                        text={runtime?.isRunning ? "Szünet" : "Folytatás"}
                        onClick={handlePause}
                    />
                    <Button className="btn-finish" text={"Út vége"} onClick={handleFinish} />
                </div>
            ) : (
                <div className="trip-controls">
                    <Button text={"Törlés"} onClick={handleDelete} />
                    <Button text={"Mentés"} onClick={handleSaveFinish} />
                </div>
            )}
        </div>
    );
}






