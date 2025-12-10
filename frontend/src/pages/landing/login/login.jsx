import "./login.css"

import { useState } from "react"

import Card from "../../../components/card/card"
import Input from "../../../components/input/input"
import Button from "../../../components/button/button"


export default function Login(){

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    function handleLogin(){
        console.log({username})
        console.log({password})
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

            <Button
                text="Bejelentkezés"
                onClick={handleLogin}
            />

        </Card>
    )
}