import { Link } from "react-router-dom"
import { useState } from "react"

import tripsAndFuelsIcon from "../../../../assets/menu-points/trips-fuels.png"
import gasStationsIcon from "../../../../assets/menu-points/gas-stations.png"
import statisticsIcon from "../../../../assets/menu-points/statistics.png"
import servicelogIcon from "../../../../assets/menu-points/servicelog.png"

import EventItem from "../../../../components/event-item/eventItem"
import NewEvent from "../../../../modals/newEvent/newEvent"
import Button from "../../../../components/button/button"

import "./menu.css"

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false)
  const [showNewEvent, setShowNewEvent] = useState(false)

  const closeMenu = () => setIsOpen(false)

  const staticEvents = [
    { id: 1, title: "Olajcsere", km: "7 646" },
    { id: 2, title: "Autópálya matrica", days: "96" },
    { id: 3, title: "Fékbetét szett", days: "734", km: "34 435" },
    { id: 4, title: "Gyújtógyertya", km: "31 692" },
    { id: 5, title: "Akkumulátor", days: "1158" },
    { id: 6, title: "Akkumulátor", days: "1158" },
    { id: 7, title: "Akkumulátor", days: "1158" },
    { id: 8, title: "Akkumulátor", days: "1158" },
  ];

  return (
    <>
      <button
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
      />

      <div className={`menu-panel ${isOpen ? "is-open" : ""}`}>
        <div className="menu-items">
          <Link className="menu-item" to="/muszerfal/utak-tankolasok" onClick={closeMenu}>
            <img className="menu-icon" src={tripsAndFuelsIcon} alt="UT"/>
            <p className="menu-text">Utak & Tankolások</p>
          </Link>

          <Link className="menu-item" to="/muszerfal/benzinkutak" onClick={closeMenu}>
            <img className="menu-icon" src={gasStationsIcon} alt="SZN"/>
            <p className="menu-text">Benzinkutak</p>
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

        <div className="menu-events d-flex flex-column">
          <div>
            <h3>Események</h3>
            <hr className="my-2 mx-3"/>
          </div>
          
          <div className="menu-events-content overflow-auto">
            {staticEvents.length > 0 ? (
              staticEvents.map(event => (
                <EventItem 
                  key={event.id} 
                  title={event.title} 
                  days={event.days} 
                  km={event.km} 
                />
              ))
            ) : (
              <div>
                <p>Még nem adott hozzá eseményt.</p>
              </div>
            )}
          </div>
            
            <hr className="my-2 mx-3"/>
          
          <div>
             <Button 
              text="Új esemény" 
              onClick={() => setShowNewEvent(true)}
             />
          </div>
        </div>
      </div>
      
      {showNewEvent && (
        <NewEvent onClose={() => setShowNewEvent(false)}/>
      )}
    </>
  )
}