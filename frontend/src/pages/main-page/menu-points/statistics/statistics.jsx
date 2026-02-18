import Navbar from "../../../../components/navbar/navbar";
import { useEffect, useState } from "react";
import { getGeneralStats, getSummaryStats } from "../../../../actions/stats/statsActions";

import GeneralStats from "./general-stats/generalStats";
import DataVisual from "./data-visual/dataVisual";
import AllCars from "./all-cars/allCars";

import "./statistics.css";

export default function Statistics() {
    const [generalStats, setGeneralStats] = useState(null);
    const [summaryStats, setSummaryStats] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            setLoading(true);
            setError("");
            try {
                const [generalData, summaryData] = await Promise.all([
                    getGeneralStats(),
                    getSummaryStats(),
                ]);
                setGeneralStats(generalData);
                setSummaryStats(summaryData);
            } catch (err) {
                setError(err.message || "Nem sikerült betölteni a statisztikákat.");
            } finally {
                setLoading(false);
            }
        }

        loadStats();
    }, []);

    return (
        <>
            <Navbar />
            <div className="container py-5">
                <h1 className="text-center text-primary mb-5 fw-bold">Statisztikák</h1>
                {loading && <p className="text-center text-light">Betöltés...</p>}
                {error && <p className="text-center text-danger">{error}</p>}
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-10">
                        <GeneralStats generalStats={generalStats} />
                        <hr className="m-5" />
                        <DataVisual />
                        <hr className="m-5" />
                        <AllCars summaryStats={summaryStats} />
                    </div>
                </div>
            </div>
        </>
    );
}


