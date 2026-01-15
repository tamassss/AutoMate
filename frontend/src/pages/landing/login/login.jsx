import "./login.css"

import api from "../../../api/axios"
import { useAuth } from "../../../auth/AuthContext";

import { useState } from "react"

import Card from "../../../components/card/card"
import Input from "../../../components/input/input"
import Button from "../../../components/button/button"


export default function Login() {

    const { loginUser, logoutUser } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit = async (e) => {
        e.preventDefault();

        const res = await loginUser(email, password);
        if (res.status == 200) {
            console.log("User succesfully loged in")
            try {
                const who = await api.get("/api/whoami");
                console.log("Whoami:", who.data);
                logoutUser()
                console.log("user is logged out")
            } catch (err) {
                console.error("Error fetching whoami:", err.response?.status || err.message);
            }
        }
        else {
            console.log("This login did not work now.\nTry again with another email or password")
        }
    };
    return (
        <Card>
            <h3>Bejelentkezés</h3>
            <Input
                type="text"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email cím"
            />
            <Input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Jelszó"
            />
            <Button
                text="Bejelentkezés"
                onClick={submit}
            />
        </Card>
    )
}