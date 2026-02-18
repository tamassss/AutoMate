import "./login.css";

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../actions/auth/authActions";

import Card from "../../../components/card/card";
import Input from "../../../components/input/input";
import Button from "../../../components/button/button";
import ErrorModal from "../../../components/error-modal/errorModal";

export default function Login() {
  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();

  const [errorMessage, setErrorMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    const em = emailRef.current.value?.trim();
    const pw = passwordRef.current.value;

    const tempErrors = {};
    if (!em) tempErrors.email = "Az e-mail cím megadása kötelező!";
    if (!pw) tempErrors.password = "A jelszó megadása kötelező!";

    if (Object.keys(tempErrors).length > 0) {
      setFieldErrors(tempErrors);
      return;
    }

    try {
      await login(em, pw);
      navigate("/autok");
    } catch (err) {
      setErrorMessage(err.message || "Ismeretlen hiba!");
    }
  }

  return (
    <Card>
      {errorMessage && (
        <ErrorModal
          onClose={() => setErrorMessage(null)}
          title={"Bejelentkezési hiba"}
          description={errorMessage}
        />
      )}

      <h3 className="mt-2">Bejelentkezés</h3>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <form onSubmit={handleLogin}>
        <div className="px-2">
          <Input type="text" inputRef={emailRef} placeholder="Email cím" error={fieldErrors.email} onChange={() => fieldErrors.email && setFieldErrors((prev) => ({ ...prev, email: "" }))} />
        </div>

        <div className="px-2">
          <Input type="password" inputRef={passwordRef} placeholder="Jelszó" error={fieldErrors.password} onChange={() => fieldErrors.password && setFieldErrors((prev) => ({ ...prev, password: "" }))} />
        </div>

        <div className="custom-btn-div">
          <Button text="Bejelentkezés" type={"submit"} />
        </div>
      </form>
    </Card>
  );
}

