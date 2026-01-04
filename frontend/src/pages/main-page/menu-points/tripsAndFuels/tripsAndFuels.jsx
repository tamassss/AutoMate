import Navbar from "../../../../components/navbar/navbar"
import "./tripsAndFuels.css"

import { useNavigate } from "react-router-dom"

import backIcon from "../../../../assets/icons/back.png"

import { Link } from "react-router-dom"

export default function TripsAndFuels(){
    const navigate = useNavigate();

    return(
        <>
            <Navbar leftIcon={backIcon} altLeft={"Vissza"} onLeftClick={() => navigate("/muszerfal")}/>
        </>
    )
}