import { useState } from "react";
import Button from "../../components/button/button";
import LabeledInput from "../../components/labeledInput/labeledInput";
import Modal from "../../components/modal/modal";
import { limitTextLength } from "../../actions/shared/inputValidation";

import "./settings.css";

export default function Settings({ onClose }) {
  const [fullName, setFullName] = useState(() => (localStorage.getItem("full_name") || "").trim());
  const [email, setEmail] = useState(() => (localStorage.getItem("email") || "").trim());
  const [password, setPassword] = useState(() => localStorage.getItem("password") || "");
  const [fieldErrors, setFieldErrors] = useState({});

  function handleSave() {
    const tempErrors = {};
    if (!fullName.trim()) tempErrors.fullName = "A teljes név megadása kötelező!";
    if (!email.trim()) tempErrors.email = "Az e-mail cím megadása kötelező!";
    if (!password) tempErrors.password = "A jelszó megadása kötelező!";

    if (Object.keys(tempErrors).length > 0) {
      setFieldErrors(tempErrors);
      return;
    }

    onClose?.();
  }

  return (
    <Modal title={"Beállítások"} onClose={onClose} columns={1} footer={<Button text={"Megváltoztatás"} onClick={handleSave} />}>
      <LabeledInput
        label={"Teljes név"}
        value={fullName}
        maxLength={30}
        onChange={(e) => {
          setFullName(limitTextLength(e.target.value, 30));
          if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: "" }));
        }}
        error={fieldErrors.fullName}
      />
      <LabeledInput
        label={"E-mail cím"}
        value={email}
        maxLength={50}
        onChange={(e) => {
          setEmail(limitTextLength(e.target.value, 50));
          if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
        }}
        error={fieldErrors.email}
      />
      <LabeledInput
        label={"Jelszó"}
        type={"password"}
        value={password}
        maxLength={50}
        onChange={(e) => {
          setPassword(limitTextLength(e.target.value, 50));
          if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
        }}
        error={fieldErrors.password}
      />
    </Modal>
  );
}
