import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCars, returnSelectedCard } from "../../../actions/cars/carsActions";

import Button from "../../../components/button/button";
import AddCar from "../../../modals/addCar/addCar";
import { getCarImageSrc } from "../../../assets/car-images/carImageOptions";

import plusIcon from "../../../assets/icons/plus.png";
import leftArrow from "../../../assets/icons/left-arrow.png";
import rightArrow from "../../../assets/icons/right-arrow.png";

import "./carSelect.css";

export default function CarSelect({ refreshKey, onCarChange }) {
    const [cars, setCars] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showAddCar, setShowAddCar] = useState(false);
    const [slideDirection, setSlideDirection] = useState("next");
    const navigate = useNavigate();

    // Autók betöltése
    const fetchCars = () => {
        getCars()
            .then(data => setCars(data))
            .catch(() => setCars([]));
    };

    useEffect(() => {
        fetchCars();
    }, [refreshKey]);

    // Kiválasztott autó átadása
    useEffect(() => {
        if (cars.length > 0) {
            onCarChange?.(cars[activeIndex]);
        } else {
            onCarChange?.(null);
        }
    }, [cars, activeIndex, onCarChange]);

    // Nincs autó
    if (cars.length === 0) {
        return (
            <div className="d-flex justify-content-center w-100 my-5">
                <div className="main-image" onClick={() => setShowAddCar(true)}>
                    <img src={plusIcon} alt="Új" className="main-car-img" style={{ width: "30%" }} />
                </div>
                {showAddCar && (
                    <AddCar 
                        onClose={() => setShowAddCar(false)} 
                        onSave={() => { fetchCars(); setShowAddCar(false); }} 
                    />
                )}
            </div>
        );
    }

    // Következő autó
    const nextCar = () => {
        setSlideDirection("next");
        if (activeIndex === cars.length - 1) {
            setActiveIndex(0);
        } else {
            setActiveIndex(activeIndex + 1);
        }
    };

    // Előző autó
    const prevCar = () => {
        setSlideDirection("prev");
        if (activeIndex === 0) {
            setActiveIndex(cars.length - 1);
        } else {
            setActiveIndex(activeIndex - 1);
        }
    };

    // Kiválasztás
    const handleSelect = () => {
        const currentCar = cars[activeIndex];
        returnSelectedCard(currentCar.car_id);
        navigate("/muszerfal");
    };

    // Segédváltozók
    const leftIndex = activeIndex === 0 ? cars.length - 1 : activeIndex - 1;
    const rightIndex = activeIndex === cars.length - 1 ? 0 : activeIndex + 1;
    
    const current = cars[activeIndex];
    const leftCar = cars[leftIndex];
    const rightCar = cars[rightIndex];

    return (
        <div className="car-select">
            <div className="car-layout">
                
                {/* Bal */}
                <div className="side left" onClick={prevCar}>
                    <div className="mobile-arrow">
                        <img src={leftArrow} alt="Bal" />
                    </div>
                    {cars.length > 1 && (
                        <div className="side-content desktop">
                            <div className="side-image">
                                <img src={getCarImageSrc(leftCar.car_image)} alt="bal-auto" />
                            </div>
                            <p className="side-name">{leftCar.display_name}</p>
                        </div>
                    )}
                </div>

                {/* Középső */}
                <div
                    key={activeIndex}
                    className={`main-car ${slideDirection === "next" ? "slide-from-right" : "slide-from-left"}`}
                >
                    <div className="main-image" onClick={handleSelect}>
                        <img src={getCarImageSrc(current.car_image)} alt="fő-auto" className="main-car-img" />
                    </div>
                    
                    <div className="main-info">
                        <h2 className="main-title">{current.display_name}</h2>
                        
                        <div className="license-outer">
                            <div className="license-inner">
                                <div className="license-blue" />
                                <div className="license-white">
                                    <p className="license-plate">{current.license_plate}</p>
                                </div>
                            </div>
                        </div>

                        <Button text="Kiválasztás" onClick={handleSelect} className="select-btn" />
                    </div>
                </div>

                {/* Jobb */}
                <div className="side right" onClick={nextCar}>
                    <div className="mobile-arrow">
                        <img src={rightArrow} alt="Jobb" />
                    </div>
                    {cars.length > 1 && (
                        <div className="side-content desktop">
                            <div className="side-image">
                                <img src={getCarImageSrc(rightCar.car_image)} alt="jobb-auto" />
                            </div>
                            <p className="side-name">{rightCar.display_name}</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
