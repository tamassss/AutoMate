import { Link } from "react-router-dom"
import { useState } from "react"

import tripsAndFuelsIcon from "../../../../assets/menu-points/trips-fuels.png"
import statisticsIcon from "../../../../assets/menu-points/statistics.png"
import servicelogIcon from "../../../../assets/menu-points/servicelog.png"

import "./menu.css"

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* <button
        className="menu-toggle"
        type="button"
        aria-label="Menu"
        onClick={() => setIsOpen(true)}
      >
        <span className="menu-toggle-bar" />
        <span className="menu-toggle-bar" />
        <span className="menu-toggle-bar" />
      </button>

      <div
        className={`menu-overlay ${isOpen ? "is-open" : ""}`}
        onClick={closeMenu}
      /> */}

      <aside className={`menu-panel ${isOpen ? "is-open" : ""}`}>
        <div className="menu-items">
          <Link className="menu-item" to="/muszerfal/utak-tankolasok" onClick={closeMenu}>
            <img className="menu-icon" src={tripsAndFuelsIcon} alt="UT"/>
            <p className="menu-text">Utak - Tankolások</p>
          </Link>

          <Link className="menu-item" to="/muszerfal/statisztikak" onClick={closeMenu}>
            <img className="menu-icon" src={statisticsIcon} alt="S"/>
            <p className="menu-text">Statisztikák</p>
          </Link>

          <Link className="menu-item" to="/muszerfal/szerviznaplo" onClick={closeMenu}>
            <img className="menu-icon" src={servicelogIcon} alt="SZN"/>
            <p className="menu-text">Szerviznapló</p>
          </Link>
        </div>

        <section className="menu-events">
          <h3>Események</h3>
          <p>Kattintson ide új esemény hozzáadásához</p>
        </section>
      </aside>
    </>
  )
}
