import "./login.css"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../../../actions/auth"

import Card from "../../../components/card/card"
import Input from "../../../components/input/input"
import Button from "../../../components/button/button"
import ErrorModal from "../../../components/error-modal/errorModal"

export default function Login() {
    const navigate = useNavigate();

    const emailRef = useRef()
    const passwordRef = useRef()

    const [errorMessage, setErrorMessage] = useState(null)

    async function handleLogin(e){
        e.preventDefault()
        setErrorMessage(null)

        const em = emailRef.current.value
        const pw = passwordRef.current.value
        try{
            await login(em, pw);
            navigate("/autok")
        } catch (err){
            setErrorMessage(err.message || "Ismeretlen hiba!")
        }
        
    }

    
    return (
        <Card>
            {errorMessage &&
                <ErrorModal
                    onClose={() => setErrorMessage(null)}
                    title={"Bejelentkezési hiba"}
                    description={errorMessage}
                />
            }
            
            
            <h3 className="mt-2">Bejelentkezés</h3>
            {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}

            <form onSubmit={handleLogin}>
                <div className="px-2">
                <Input
                    type="text"
                    inputRef={emailRef}
                    placeholder="Email cím"
                />
                </div>

                <div className="px-2">
                <Input
                    type="password"
                    inputRef={passwordRef}
                    placeholder="Jelszó"
                />
                </div>

                <div className="custom-btn-div">
                    <Button
                        text="Bejelentkezés"
                        type={"submit"}
                    />
                </div>
            </form>           
        </Card>
    )
}