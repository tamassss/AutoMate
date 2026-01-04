import Card from "../../../../components/card/card"
import Table from "../../../../components/table/table"
import Navbar from "../../../../components/navbar/navbar"

import backIcon from "../../../../assets/icons/back.png"

import { Link, useNavigate } from "react-router-dom"

import "./statistics.css"

export default function Statistics(){
    const navigate = useNavigate();

    return(
        <>
            <Navbar leftIcon={backIcon} altLeft={"Vissza"} onLeftClick={() => navigate("/muszerfal")}/>
            <h1>Statisztikák</h1>
            <Card>
                <h2>Általános Statisztikák</h2>
                <Table>
                    <tr>
                        <th>Regisztrálás időpontja</th>
                        <td>DB</td>
                    </tr>

                    <tr>
                        <th>Megtett táv használat óta</th>
                        <td>DB</td>
                    </tr>

                    <tr>
                        <th>Tankolások használat óta</th>
                        <td>DB</td>
                    </tr>

                    <tr>
                        <th>Javított/Rontott idő (DB - javított/rontott)</th>
                        <td>DB (+ szín piros/zöld)</td>
                    </tr>

                    <tr>
                        <th>Leghosszabb út</th>
                        <td>DB</td>
                    </tr>
                </Table>
            </Card>
            <hr/>
            <Card>
                <h2>Adatábrázolás</h2>
                <p>...</p>
            </Card>
            <hr/>
            <Card>
                <h2>Összesített Statisztika</h2>
                <Table>
                    <tr>
                        <th>Autó</th>
                        <th>Megtett Táv</th>
                        <th>Tankolások</th>
                        <th>Javított/Rontott idő (DB)</th>
                    </tr>
                    <tr>
                        <td>...</td>
                    </tr>
                </Table>
            </Card>
        </>
    )
}