import { useEffect, useState } from "react";
import {getCars, returnSelectedCard} from "../../../actions/cars" ;
import { Link, useNavigate } from "react-router-dom";

import Button from "../../../components/button/button";
import placeholder from "../../../assets/icons/car.png"
import plusIcon from "../../../assets/icons/plus.png"
import leftArrow from "../../../assets/icons/left-arrow.png"
import rightArrow from "../../../assets/icons/right-arrow.png"

import AddCar from "../../../modals/addCar/addCar";

import "./carSelect.css"

export default function CarSelect({refreshKey, onCarChange}){
    const [cars, setCars] = useState([]);

    useEffect(() => {
        getCars().then(setCars).catch(() => setCars([]))
    }, [refreshKey])

    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const [showAddCar, setShowAddCar] = useState(false);

    const hasMultiple = cars.length > 1;

    useEffect(() => {
        if (cars.length > 0) {
            const safeIndex = Math.min(activeIndex, cars.length - 1);
            onCarChange?.(cars[safeIndex]);
        } else {
            onCarChange?.(null);
        }
    }, [cars, activeIndex, onCarChange]);


    if(cars.length === 0)
        return (
            <>
                <div className="d-flex justify-content-center w-100 my-5">
                    <div className="main-image" onClick={() => setShowAddCar(true)}>
                        <img 
                            src={plusIcon} 
                            alt="Új autó" 
                            className="main-car-img" 
                            style={{width:"30%"}}
                        />
                    </div>
                </div>

                {showAddCar && (
                    <AddCar
                      onClose={() => setShowAddCar(false)}
                      onSave={() => {
                        getCars().then(setCars).catch(() => setCars([]));
                        setShowAddCar(false);
                      }}
                    />
                )}
            </>
        )

    const current = cars[activeIndex]
    const left =  cars[(activeIndex - 1 + cars.length) % cars.length];
    const right = cars[(activeIndex + 1) % cars.length];

    function nextCar() {
        setActiveIndex((prev) => (prev + 1) % cars.length);
    }

    function prevCar() {
        setActiveIndex((prev) => (prev - 1 + cars.length) % cars.length
        );
    }

    function onSelect(){
        returnSelectedCard(current.car_id)
        navigate("/muszerfal")
    }

return(
    <div className="car-select">
        <div className="car-layout">
        
            <div className="side left" onClick={prevCar}>
                <div className="mobile-arrow">
                    <img src={leftArrow} alt="Előző" className="left-arrow"/>
                </div>
                {hasMultiple && (
                    <div className="side-content desktop">
                        <div className="side-image">
                            <img src={placeholder} alt={left.display_name}/>
                        </div>
                        <p className="side-name">{left.display_name}</p>
                    </div>
                )}
            </div>

            <div className="main-car">
                <div className="main-image">
                    <img src={placeholder} alt={current.display_name} className="main-car-img"/>
                </div>
                <div className="main-info">
                    <h2 className="main-title">{current.display_name}</h2>
                    <Link to="/muszerfal" className="select-link">
                      <Button text={"Kiválasztás"} onClick={onSelect}className="select-btn"/>
                    </Link>
                </div>
            </div>

            <div className="side right" onClick={nextCar}>
                <div className="mobile-arrow">
                    <img src={rightArrow} alt="Következő" className="right-arrow"/>
                </div>
                {hasMultiple && (
                    <div className="side-content desktop">
                        <div className="side-image">
                            <img src={placeholder} alt={right.display_name}/>
                        </div>
                        <p className="side-name">{right.display_name}</p>
                    </div>
                )}
            </div>

        </div>

    </div>
    )
}