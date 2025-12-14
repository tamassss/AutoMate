import "./login.css"

import { useState } from "react"
import { Link } from "react-router-dom"

import Card from "../../../components/card/card"
import Input from "../../../components/input/input"
import Button from "../../../components/button/button"


export default function Login(){

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    function handleLogin(){
        return
    }

    return(
        <Card>

            <h3>Bejelentkezés</h3>

            <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Felhasználónév"
            />
            
            <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Jelszó"
            />

            <Link to="/cars">
                <Button
                    text="Bejelentkezés"
                    onClick={handleLogin}
                />
            </Link>

        </Card>
    )
}