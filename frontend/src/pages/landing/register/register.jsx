import { useRef, useState } from "react";
import Input from "../../../components/input/input";
import Card from "../../../components/card/card";
import Button from "../../../components/button/button";
import ErrorModal from "../../../components/error-modal/errorModal";
import { register } from "../../../actions/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const fullNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordAgainRef = useRef();
    
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault()
        setErrorMessage(null);

        const fn = fullNameRef.current.value;
        const em = emailRef.current.value;
        const pw = passwordRef.current.value;
        const pwA = passwordAgainRef.current.value;

        if (pw !== pwA) {
            setErrorMessage("A két jelszó nem egyezik!");
            return;
        }

        try {
            await register(em, pw, fn);
            alert("Sikeres regisztráció! Most jelentkezz be.");
            navigate("/");
        } catch (err) {
            setErrorMessage(err.message);
        }
    }

    return (
        <Card>
            {errorMessage && 
                <ErrorModal
                    onClose={() => setErrorMessage(null)}
                    title={"Regisztrálási hiba"}
                    description={errorMessage}
                />
            }
            
            <h3 className="mt-2">Regisztráció</h3>
            {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}

            <form onSubmit={handleRegister}>
            <div className="px-2">
                <Input type="text" inputRef={fullNameRef} placeholder="Teljes név" />
            </div>
            <div className="px-2">
                <Input type="email" inputRef={emailRef} placeholder="E-mail cím" />
            </div>
            <div className="px-2">
                <Input type="password" inputRef={passwordRef} placeholder="Jelszó" />
            </div>
            <div className="px-2">
                <Input type="password" inputRef={passwordAgainRef} placeholder="Jelszó ismét" />
            </div>
            
            <div className="custom-btn-div">
                <Button text="Regisztráció" type={"submit"} />
            </div>
            </form>
        </Card>
    );
}