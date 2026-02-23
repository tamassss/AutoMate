import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import tripsAndFuelsIcon from "../../../../assets/menu-points/trips-fuels.png";
import gasStationsIcon from "../../../../assets/menu-points/gas-stations.png";
import statisticsIcon from "../../../../assets/menu-points/statistics.png";
import servicelogIcon from "../../../../assets/menu-points/servicelog.png";
import communityIcon from "../../../../assets/menu-points/community.png";

import EventItem from "../../../../components/event-item/eventItem";
import NewEvent from "../../../../modals/newEvent/newEvent";
import Button from "../../../../components/button/button";
import { getDashboard } from "../../../../actions/dashboard/dashboardActions";

import "./menu.css";

export default function Menu({ events = [], onEventCreated }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [loadedEvents, setLoadedEvents] = useState([]);

  const closeMenu = () => setIsOpen(false);
  const menuEvents = events.length > 0 ? events : loadedEvents;

  async function loadEvents() {
    try {
      const data = await getDashboard();
      setLoadedEvents(data?.events?.items || []);
    } catch {
      setLoadedEvents([]);
    }
  }

  useEffect(() => {
    loadEvents();
  }, [location.pathname]);

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
          <NavLink className={({ isActive }) => `menu-item ${isActive ? "menu-item-active" : ""}`} to="/muszerfal/utak-tankolasok" onClick={closeMenu}>
            <img className="menu-icon" src={tripsAndFuelsIcon} alt="UT"/>
            <p className="menu-text">Utak és tankolások</p>
          </NavLink>

          <NavLink className={({ isActive }) => `menu-item ${isActive ? "menu-item-active" : ""}`} to="/muszerfal/benzinkutak" onClick={closeMenu}>
            <img className="menu-icon" src={gasStationsIcon} alt="BK"/>
            <p className="menu-text">Benzinkutak</p>
          </NavLink>

          <NavLink className={({ isActive }) => `menu-item ${isActive ? "menu-item-active" : ""}`} to="/muszerfal/statisztikak" onClick={closeMenu}>
            <img className="menu-icon" src={statisticsIcon} alt="S"/>
            <p className="menu-text">Statisztikák</p>
          </NavLink>

          <NavLink className={({ isActive }) => `menu-item ${isActive ? "menu-item-active" : ""}`} to="/muszerfal/szerviznaplo" onClick={closeMenu}>
            <img className="menu-icon" src={servicelogIcon} alt="SZN"/>
            <p className="menu-text">Szerviznapló</p>
          </NavLink>

          <NavLink className={({ isActive }) => `menu-item ${isActive ? "menu-item-active" : ""}`} to="/muszerfal/kozosseg" onClick={closeMenu}>
            <img className="menu-icon" src={communityIcon} alt="K"/>
            <p className="menu-text">Közösség</p>
          </NavLink>
        </div>

        <div className="menu-events d-flex flex-column">
          <div>
            <h3>Események</h3>
            <hr className="my-2 mx-3"/>
          </div>

          <div className="menu-events-content overflow-auto">
            {menuEvents.length > 0 ? (
              menuEvents.map((event) => (
                <EventItem
                  key={event.maintenance_id}
                  title={event.part_name || "Esem�ny"}
                  reminder={event.reminder}
                />
              ))
            ) : (
              <div>
                <p>Még nincs felvett esemény.</p>
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
        <NewEvent
          onClose={() => setShowNewEvent(false)}
          onSave={async (payload) => {
            await onEventCreated?.(payload);
            await loadEvents();
            setShowNewEvent(false);
          }}
        />
      )}
    </>
  );
}