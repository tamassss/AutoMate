import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/navbar/navbar";
import Loading from "../../../components/loading/loading";
import SuccessModal from "../../../components/success-modal/successModal";
import {
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
} from "../../../actions/admin/adminActions";
import "./adminPage.css";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [originalRows, setOriginalRows] = useState({});
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadUsers(email = "") {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminUsers(email);
      setUsers(data);

      const nextEditedRows = {};
      const nextOriginalRows = {};

      data.forEach((user) => {
        const rowData = {
          full_name: user.full_name || "",
          email: user.email || "",
          password: user.password || "",
          role: user.role || "user",
        };

        nextEditedRows[user.user_id] = { ...rowData };
        nextOriginalRows[user.user_id] = { ...rowData };
      });

      setEditedRows(nextEditedRows);
      setOriginalRows(nextOriginalRows);
    } catch (err) {
      setError(err?.message || "Nem sikerült betölteni a felhasználókat.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleRowChange(userId, field, value) {
    setEditedRows((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }));
  }

  function hasRowChanged(userId) {
    const edited = editedRows[userId];
    const original = originalRows[userId];
    if (!edited || !original) return false;

    return (
      (edited.full_name || "") !== (original.full_name || "") ||
      (edited.email || "") !== (original.email || "") ||
      (edited.role || "user") !== (original.role || "user") ||
      (edited.password || "") !== (original.password || "")
    );
  }

  async function handleSearchSubmit(e) {
    e.preventDefault();
    await loadUsers(searchEmail);
  }

  async function handleSave(user) {
    const edited = editedRows[user.user_id];
    const original = originalRows[user.user_id];
    if (!edited || !original) return;

    setError("");

    const payload = {};

    if ((edited.full_name || "") !== (original.full_name || "")) {
      payload.full_name = edited.full_name;
    }

    if ((edited.email || "") !== (original.email || "")) {
      payload.email = edited.email;
    }

    if ((edited.role || "user") !== (original.role || "user")) {
      payload.role = edited.role;
    }

    if ((edited.password || "") !== (original.password || "")) {
      payload.password = edited.password;
    }

    if (Object.keys(payload).length === 0) {
      return;
    }

    try {
      await updateAdminUser(user.user_id, payload);
      await loadUsers(searchEmail);
      setSuccessMessage("Sikeres módosítás.");
    } catch (err) {
      setError(err?.message || "Nem sikerült módosítani a felhasználót.");
    }
  }

  async function handleDelete(user) {
    setError("");

    try {
      await deleteAdminUser(user.user_id);
      await loadUsers(searchEmail);
      setSuccessMessage("Sikeres törlés.");
    } catch (err) {
      setError(err?.message || "Nem sikerült törölni a felhasználót.");
    }
  }

  return (
    <div className="admin-page">
      <Navbar forceHomeLink />

      <div className="admin-page-content container">
        <div className="admin-header-row">
          <h1 className="admin-title">Admin felület</h1>
          <Link to="/" className="admin-home-link">Főoldal</Link>
        </div>

        <form className="admin-search-row" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Keresés email alapján"
            className="admin-search-input"
          />
          <button type="submit" className="admin-action-btn admin-search-btn">Keresés</button>
        </form>

        {error && <p className="admin-error">{error}</p>}

        {loading ? (
          <div className="admin-loading-wrap">
            <Loading />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark admin-table">
              <thead>
                <tr className="even">
                  <th>Email</th>
                  <th>Név</th>
                  <th>Jelszó</th>
                  <th>Jogosultság</th>
                  <th>Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const row = editedRows[user.user_id] || {};
                  const isSuperadmin = Boolean(user.is_superadmin);
                  const changed = hasRowChanged(user.user_id);
                  const rowClassName = index === 0 ? "odd" : (index % 2 === 0 ? "odd" : "even");

                  return (
                    <tr key={user.user_id} className={rowClassName}>
                      <td>
                        <input
                          type="text"
                          className="admin-cell-input"
                          value={row.email || ""}
                          onChange={(e) => handleRowChange(user.user_id, "email", e.target.value)}
                          disabled={isSuperadmin}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="admin-cell-input"
                          value={row.full_name || ""}
                          onChange={(e) => handleRowChange(user.user_id, "full_name", e.target.value)}
                          disabled={isSuperadmin}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="admin-cell-input"
                          value={row.password || ""}
                          onChange={(e) => handleRowChange(user.user_id, "password", e.target.value)}
                          placeholder={isSuperadmin ? "Superadmin" : "Jelszó"}
                          disabled={isSuperadmin}
                        />
                      </td>
                      <td>
                        <select
                          className="admin-cell-input admin-role-select"
                          value={row.role || "user"}
                          onChange={(e) => handleRowChange(user.user_id, "role", e.target.value)}
                          disabled={isSuperadmin}
                        >
                          <option value="user">felhasználó</option>
                          <option value="admin">admin</option>
                          <option value="moderator">moderátor</option>
                        </select>
                      </td>
                      <td className="admin-buttons-cell">
                        {isSuperadmin ? (
                          <span className="superadmin-tag">superadmin</span>
                        ) : (
                          <>
                            <button
                              type="button"
                              className={`admin-action-btn ${!changed ? "unavailable" : ""}`}
                              onClick={() => handleSave(user)}
                              disabled={!changed}
                            >
                              Módosítás
                            </button>
                            <button type="button" className="admin-delete-btn" onClick={() => handleDelete(user)}>
                              Törlés
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {successMessage && (
        <SuccessModal
          description={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}
    </div>
  );
}
