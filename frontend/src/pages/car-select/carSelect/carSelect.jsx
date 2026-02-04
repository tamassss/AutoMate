import { useState } from "react";
import { cars } from "../../../data"
import { Link } from "react-router-dom";

import Button from "../../../components/button/button";
import placeholder from "../../../assets/icons/car.png"

import leftArrow from "../../../assets/icons/left-arrow.png"
import rightArrow from "../../../assets/icons/right-arrow.png"

import "./carSelect.css"




export default function CarSelect(){
    const [activeIndex, setActiveIndex] = useState(0);

    const hasMultiple = cars.length > 1;

    if(cars.length === 0)
        return <p>Még nem adott hozzá autót</p>

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
                            <img src={placeholder} alt={left.name}/>
                        </div>
                        <p className="side-name">{left.name}</p>
                    </div>
                )}
            </div>

            <div className="main-car">
                <div className="main-image">
                    <img src={placeholder} alt={current.name} className="main-car-img"/>
                </div>
                <div className="main-info">
                    <h2 className="main-title">{current.name}</h2>
                    <Link to="/muszerfal" className="select-link">
                      <Button text={"Kiválasztás"} className="select-btn"/>
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
                            <img src={placeholder} alt={right.name}/>
                        </div>
                        <p className="side-name">{right.name}</p>
                    </div>
                )}
            </div>

        </div>
    </div>
    )
}