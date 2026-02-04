import "./register.css"

import Card from "../../../components/card/card"
import Input from "../../../components/input/input"
import Button from "../../../components/button/button"

import { useState } from "react"

export default function Register(){
    const [username, setUsername] = useState("")
    const [surname, setSurname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordAgain, setPasswordAgain] = useState("")

    function handleRegister(){
        console.log({username})
        console.log({surname})
        console.log({email})
        console.log({password})
        console.log({passwordAgain})
    }

    function checkPasswordMatching(){
        if(password != passwordAgain){
            return false
        }
            return true
    }

    return(
        <Card>
            <h3 className="mt-2">Regisztráció</h3>

            <div className="px-2">
            <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Felhasználónév"
            />
            </div>

            <div className="px-2">
            <Input
                type="text"
                id="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Keresztnév"
            />
            </div>

            <div className="px-2">
            <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail cím"
            />
            </div>

            <div className="px-2">
            <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Jelszó"
            />
            </div>

            <div className="px-2">
            <Input
                type="password"
                id="passwordAgain"
                value={passwordAgain}
                onChange={(e) => setPasswordAgain(e.target.value)}
                placeholder="Jelszó"
            />
            </div>
            
            <div className="custom-btn-div">
                <Button
                    text="Regisztráció"
                    onClick={handleRegister}
                />
            </div>
            
        </Card>
    )
}