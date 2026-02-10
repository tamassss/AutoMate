import Card from "../../../../components/card/card"
import Table from "../../../../components/table/table"
import Navbar from "../../../../components/navbar/navbar"

import backIcon from "../../../../assets/icons/back.png"
import GeneralStats from "./general-stats/generalStats"
import DataVisual from "./data-visual/dataVisual"
import AllCars from "./all-cars/allCars"

import { Link, useNavigate } from "react-router-dom"

import "./statistics.css"

export default function Statistics(){
    const navigate = useNavigate();

    return(
        <>
            <Navbar leftIcon={backIcon} altLeft={"Vissza"} onLeftClick={() => navigate("/muszerfal")}/>
            <div className="container py-5">
              <h1 className="text-center text-primary mb-5 fw-bold">Statisztikák</h1>
              <div className="row justify-content-center">
                <div className="col-12 col-xl-10">
                  <GeneralStats />
                  <hr className="m-5"/>
                  <DataVisual />
                  <hr className="m-5"/>
                  <AllCars />
                </div>
              </div>
            </div>
        </>
    )
}