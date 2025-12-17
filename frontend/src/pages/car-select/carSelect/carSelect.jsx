import { useState } from "react";
import { cars } from "../../../data"
import "./carSelect.css"
import Button from "../../../components/button/button";
import { Link } from "react-router-dom";

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

        <div className="car left" onClick={prevCar}>
            {hasMultiple && <p>{left.name}</p>}
        </div>

        <div className="car active">
          <h2>{current.name}</h2>
          <p>{current.year}</p>
          <Link to="/muszerfal">
            <Button text={"Kiválasztás"}/>
          </Link>
        </div>

        <div className="car right" onClick={nextCar}>
          {hasMultiple && <p>{right.name}</p>}
        </div>

    </div>
    )
}