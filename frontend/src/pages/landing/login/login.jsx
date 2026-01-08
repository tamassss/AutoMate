import "./login.css"
import axios from "axios"

import { useState } from "react"
import { Link } from "react-router-dom"

import Card from "../../../components/card/card"
import Input from "../../../components/input/input"
import Button from "../../../components/button/button"


export default function Login(){

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const login = async () => {
      try {
        const res = await axios.post("http://localhost:4000/login", {
          username,
          password
        });
    
        const token = res.data.token;
    
        // store token (simple method)
        localStorage.setItem("token", token);
    
        alert("Logged in!");
        console.log(token)
      } catch (err) {
        alert(`Login failed ${err}`);
      }
      
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

            <Link to="/autok">
                <Button
                    text="Bejelentkezés"
                    onClick={login}
                />
            </Link>

        </Card>
    )
}