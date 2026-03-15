import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/navbar/navbar";
import Loading from "../../../components/loading/loading";
import SuccessModal from "../../../components/success-modal/successModal";
import { deleteAdminUser, getAdminUsers, updateAdminUser } from "../../../actions/admin/adminActions";
import "./adminPage.css";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Felhasználók betöltése
  const loadUsers = async (email = "") => {
    setLoading(true);
    try {
      const data = await getAdminUsers(email);

      setUsers(data.map(u => ({
        ...u,
        full_name: u.full_name || "",
        password: "",
        role: u.role || "user"
      })));
    } catch (err) {
      setError("Nem sikerült betölteni a listát.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  //írás közben
  const handleChange = (id, field, value) => {
    setUsers(prev => prev.map(u => u.user_id === id ? { ...u, [field]: value, isChanged: true } : u));
  };

  //Mentés
  const handleSave = async (user) => {
    setError("");
    try {
      const { full_name, email, role, password } = user;
      await updateAdminUser(user.user_id, { full_name, email, role, password });
      
      setSuccessMessage("Sikeres módosítás.");
      loadUsers(searchEmail);
    } catch (err) {
      setError("Hiba a mentés során.");
    }
  };

  //törlés
  const handleDelete = async (id) => {
    try {
      await deleteAdminUser(id);
      setSuccessMessage("Sikeres törlés.");
      loadUsers(searchEmail);
    } catch (err) {
      setError("Hiba a törlésnél.");
    }
  };

  return (
    <div className="admin-page">
      <Navbar forceHomeLink />
      <div className="admin-page-content container">
        <div className="admin-header-row">
          <h1>Admin felület</h1>
          <Link to="/">Főoldal</Link>
        </div>

        <form className="admin-search-row" onSubmit={(e) => { e.preventDefault(); loadUsers(searchEmail); }}>
          <input 
            type="text" 
            placeholder="Keresés email alapján..." 
            value={searchEmail} 
            onChange={e => setSearchEmail(e.target.value)} 
          />
          <button type="submit" className="admin-search-btn">Keresés</button>
        </form>

        {error && <p className="admin-error">{error}</p>}

        {loading ? <Loading /> : (
          <div className="table-responsive">

            <table className="table table-dark admin-table">
              
              <thead>
                <tr>
                  <th>Email</th><th>Név</th><th>Jelszó</th><th>Jog</th><th>Műveletek</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.user_id} className={user.is_superadmin ? "superadmin-row" : ""}>
                    <td><input value={user.email} onChange={e => handleChange(user.user_id, "email", e.target.value)} disabled={user.is_superadmin} /></td>
                    <td><input value={user.full_name} onChange={e => handleChange(user.user_id, "full_name", e.target.value)} disabled={user.is_superadmin} /></td>
                    <td><input type="password" placeholder="Új jelszó" onChange={e => handleChange(user.user_id, "password", e.target.value)} disabled={user.is_superadmin} /></td>
                    <td>
                      <select value={user.role} onChange={e => handleChange(user.user_id, "role", e.target.value)} disabled={user.is_superadmin}>
                        <option value="user">Felhasználó</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderátor</option>
                      </select>
                    </td>
                    <td className="admin-buttons-cell">
                      {user.is_superadmin ? <span className="superadmin-tag">superadmin</span> : (
                        <>
                          <button onClick={() => handleSave(user)} disabled={!user.isChanged} className={!user.isChanged ? "unavailable" : ""}>Mentés</button>
                          <button onClick={() => handleDelete(user.user_id)} className="admin-delete-btn">Törlés</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
      {successMessage && <SuccessModal description={successMessage} onClose={() => setSuccessMessage("")} />}
    </div>
  );
}