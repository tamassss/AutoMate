import { useState } from "react";
import Button from "../../components/button/button";
import LabeledInput from "../../components/labeledInput/labeledInput";
import Modal from "../../components/modal/modal";
import { limitTextLength } from "../../actions/shared/inputValidation";
import { updateProfileSettings } from "../../actions/auth/authActions";

import "./settings.css";

export default function Settings({ onClose }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [fullName, setFullName] = useState(() => (localStorage.getItem("full_name") || "").trim());
  const [email, setEmail] = useState(() => (localStorage.getItem("email") || "").trim());
  const [password, setPassword] = useState(() => localStorage.getItem("password") || "");
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setErrorMessage("");

    if (!isUnlocked) {
      if (!unlockPassword) {
        setFieldErrors({ unlockPassword: "A jelszó megadása kötelező!" });
        return;
      }

      const savedPassword = localStorage.getItem("password") || "";
      if (unlockPassword !== savedPassword) {
        setFieldErrors({ unlockPassword: "Hibás jelszó!" });
        return;
      }

      setFieldErrors({});
      setIsUnlocked(true);
      return;
    }

    const tempErrors = {};
    if (!fullName.trim()) tempErrors.fullName = "A teljes név megadása kötelező!";
    if (!email.trim()) tempErrors.email = "Az e-mail cím megadása kötelező!";
    if (!password) tempErrors.password = "A jelszó megadása kötelező!";

    if (Object.keys(tempErrors).length > 0) {
      setFieldErrors(tempErrors);
      return;
    }

    try {
      setIsSaving(true);
      await updateProfileSettings({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });
      onClose?.();
    } catch (err) {
      setErrorMessage(err.message || "Nem sikerült menteni a beállításokat.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal
      title={"Beállítások"}
      onClose={onClose}
      columns={1}
      onSubmit={handleSave}
      footer={<Button text={isUnlocked ? (isSaving ? "Mentés..." : "Megváltoztatás") : "Tovább"} type={"submit"} />}
    >
      {!isUnlocked ? (
        <>
          <p className="m-0">Add meg a jelszót a folytatáshoz.</p>
          <LabeledInput
            label={"Jelszó"}
            type={"text"}
            value={unlockPassword}
            maxLength={50}
            onChange={(e) => {
              setUnlockPassword(limitTextLength(e.target.value, 50));
              if (fieldErrors.unlockPassword) setFieldErrors((prev) => ({ ...prev, unlockPassword: "" }));
            }}
            error={fieldErrors.unlockPassword}
          />
        </>
      ) : (
        <>
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
            type={"text"}
            value={password}
            maxLength={50}
            onChange={(e) => {
              setPassword(limitTextLength(e.target.value, 50));
              if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
            }}
            error={fieldErrors.password}
          />
        </>
      )}
      {errorMessage && <p className="text-danger m-0">{errorMessage}</p>}
    </Modal>
  );
}
