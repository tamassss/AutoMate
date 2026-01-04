import "./modal.css";
import backIcon from "../../assets/icons/back.png";

export default function Modal({ title, children, onClose, columns = 2 }) {
  return (
    <div className="modal-wrapper">
      <div className="overlay" onClick={onClose}></div>

      <div className="modal-content">
        <div className="modal-header">
          <img
            src={backIcon}
            className="modal-back"
            onClick={onClose}
            alt="Vissza"
          />
          <h3 className="modal-title">{title}</h3>
        </div>
        <div className={`modal-body ${columns === 2 ? "two-col" : "one-col"}`}>
            {children}
        </div>
      </div>
    </div>
  );
}
