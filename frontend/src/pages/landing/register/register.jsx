import { useRef, useState } from "react";
import Input from "../../../components/input/input";
import Card from "../../../components/card/card";
import Button from "../../../components/button/button";
import ErrorModal from "../../../components/error-modal/errorModal";
import { register } from "../../../actions/auth/authActions";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const fullNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordAgainRef = useRef();
    
    const [errorMessage, setErrorMessage] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault()
        setErrorMessage(null);
        setFieldErrors({});

        const fn = fullNameRef.current.value?.trim();
        const em = emailRef.current.value?.trim();
        const pw = passwordRef.current.value;
        const pwA = passwordAgainRef.current.value;

        const tempErrors = {};
        if (!fn) tempErrors.fullName = "A teljes név megadása kötelező!";
        if (!em) tempErrors.email = "Az e-mail cím megadása kötelező!";
        if (!pw) tempErrors.password = "A jelszó megadása kötelező!";
        if (!pwA) tempErrors.passwordAgain = "A jelszó ismétlése kötelező!";

        if (Object.keys(tempErrors).length > 0) {
            setFieldErrors(tempErrors);
            return;
        }

        if (pw !== pwA) {
            setFieldErrors({ passwordAgain: "A két jelszó nem egyezik!" });
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
                <Input type="text" inputRef={fullNameRef} placeholder="Teljes név" error={fieldErrors.fullName} onChange={() => fieldErrors.fullName && setFieldErrors((prev) => ({ ...prev, fullName: "" }))} />
            </div>
            <div className="px-2">
                <Input type="email" inputRef={emailRef} placeholder="E-mail cím" error={fieldErrors.email} onChange={() => fieldErrors.email && setFieldErrors((prev) => ({ ...prev, email: "" }))} />
            </div>
            <div className="px-2">
                <Input type="password" inputRef={passwordRef} placeholder="Jelszó" error={fieldErrors.password} onChange={() => fieldErrors.password && setFieldErrors((prev) => ({ ...prev, password: "" }))} />
            </div>
            <div className="px-2">
                <Input type="password" inputRef={passwordAgainRef} placeholder="Jelszó ismét" error={fieldErrors.passwordAgain} onChange={() => fieldErrors.passwordAgain && setFieldErrors((prev) => ({ ...prev, passwordAgain: "" }))} />
            </div>
            
            <div className="custom-btn-div">
                <Button text="Regisztráció" type={"submit"} />
            </div>
            </form>
        </Card>
    );
}


