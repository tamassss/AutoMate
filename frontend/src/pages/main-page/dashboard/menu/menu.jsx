import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

import tripsAndFuelsIcon from "../../../../assets/menu-points/trips-fuels.png";
import gasStationsIcon from "../../../../assets/menu-points/gas-stations.png";
import statisticsIcon from "../../../../assets/menu-points/statistics.png";
import servicelogIcon from "../../../../assets/menu-points/servicelog.png";
import communityIcon from "../../../../assets/menu-points/community.png";

import EventItem from "../../../../components/event-item/eventItem";
import NewEvent from "../../../../modals/newEvent/newEvent";
import EventsModal from "../../../../modals/eventsModal/eventsModal";
import Button from "../../../../components/button/button";
import { getDashboard } from "../../../../actions/dashboard/dashboardActions";
import { createEvent } from "../../../../actions/serviceLog/serviceLogActions";
import { getCurrentUserMeta, isCommunityEnabledForCar, setCommunityEnabledForCar } from "../../../../actions/community/communityLocalActions";

import "./menu.css";

export default function Menu({ events = [], onEventCreated }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [loadedEvents, setLoadedEvents] = useState([]);
  const [communityEnabled, setCommunityEnabled] = useState(false);
  const [savingCommunity, setSavingCommunity] = useState(false);

  const selectedCarId = Number(localStorage.getItem("selected_car_id") || 0);
  const { userId } = getCurrentUserMeta();
  const isCommunityRoute = location.pathname === "/muszerfal/kozosseg";

  const closeMenu = () => setIsOpen(false);

  // Események betöltése
  const loadEvents = useCallback(async () => {
    try {
      const data = await getDashboard();
      setLoadedEvents(data?.events?.items || []);
    } catch {
      setLoadedEvents([]);
    }
  }, []);

  // Betöltés oldalváltáskor
  useEffect(() => {
    loadEvents();
  }, [location.pathname, loadEvents]);

  // Közösségi rész állapot
  useEffect(() => {
    if (!userId || !selectedCarId) {
      setCommunityEnabled(false);
      return;
    }

    isCommunityEnabledForCar(userId, selectedCarId)
      .then(setCommunityEnabled)
      .catch(() => setCommunityEnabled(false));
  }, [userId, selectedCarId, location.pathname]);

  const handleCommunityToggle = async (event) => {
    event.stopPropagation();
    if (isCommunityRoute || savingCommunity || !selectedCarId || !userId) return;

    const enabled = !!event.target.checked;
    setSavingCommunity(true);
    try {
      const nextEnabled = await setCommunityEnabledForCar(userId, selectedCarId, enabled);
      setCommunityEnabled(nextEnabled);
    } finally {
      setSavingCommunity(false);
    }
  };

  const openEventsModal = () => {
    setShowEventsModal(true);
    closeMenu();
  };

  const menuEvents = events.length > 0 ? events : loadedEvents;

  return (
    <>
      <button className="menu-toggle" type="button" aria-label="Menu" onClick={() => setIsOpen(true)}>
        <span className="menu-toggle-bar" />
        <span className="menu-toggle-bar" />
        <span className="menu-toggle-bar" />
      </button>

      <div className={`menu-overlay ${isOpen ? "is-open" : ""}`} onClick={closeMenu} />

      <div className={`menu-panel ${isOpen ? "is-open" : ""}`}>
        <div className="menu-items">
          <NavLink className={({ isActive }) => `menu-item ${isActive ? "menu-item-active" : ""}`} to="/muszerfal/utak-tankolasok" onClick={closeMenu}>
            <img className="menu-icon" src={tripsAndFuelsIcon} alt="UT" />
            <p className="menu-text">Utak és tankolások</p>
          </NavLink>

          <NavLink className={({ isActive }) => `menu-item ${isActive ? "menu-item-active" : ""}`} to="/muszerfal/benzinkutak" onClick={closeMenu}>
            <img className="menu-icon" src={gasStationsIcon} alt="BK" />
            <p className="menu-text">Benzinkutak</p>
          </NavLink>

          <NavLink className={({ isActive }) => `menu-item ${isActive ? "menu-item-active" : ""}`} to="/muszerfal/statisztikak" onClick={closeMenu}>
            <img className="menu-icon" src={statisticsIcon} alt="S" />
            <p className="menu-text">Statisztikák</p>
          </NavLink>

          <NavLink className={({ isActive }) => `menu-item ${isActive ? "menu-item-active" : ""}`} to="/muszerfal/szerviznaplo" onClick={closeMenu}>
            <img className="menu-icon" src={servicelogIcon} alt="SZN" />
            <p className="menu-text">Szerviznapló</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `menu-item ${isActive ? "menu-item-active" : ""} ${!communityEnabled ? "menu-item-unavailable" : ""}`
            }
            to={communityEnabled ? "/muszerfal/kozosseg" : "#"}
            onClick={(e) => {
              if (!communityEnabled) e.preventDefault();
              else closeMenu();
            }}
          >
            <img className="menu-icon" src={communityIcon} alt="K" />
            <div className="menu-community-row">
              <p className="menu-text">Közösség</p>
              <input
                type="checkbox"
                checked={communityEnabled}
                disabled={isCommunityRoute || savingCommunity || !selectedCarId}
                onClick={(e) => e.stopPropagation()}
                onChange={handleCommunityToggle}
              />
            </div>
          </NavLink>
        </div>

        <div className="menu-events d-flex flex-column">
          <div className="menu-events-open-target" onClick={openEventsModal}>
            <h3>Események</h3>
            <hr className="my-2 mx-3" />
          </div>

          <div className="menu-events-content overflow-auto menu-events-open-target" onClick={openEventsModal}>
            {menuEvents.length > 0 ? (
              menuEvents.map((event) => (
                <EventItem
                  key={event.maintenance_id}
                  title={event.part_name || "Esemény"}
                  reminder={event.reminder}
                  date={event.date}
                />
              ))
            ) : (
              <div className="menu-events-empty">
                <p>Még nincs felvett esemény.</p>
              </div>
            )}
          </div>

          <hr className="my-2 mx-3" />

          <div className="menu-events-footer">
            <Button text="Új esemény" onClick={() => setShowNewEvent(true)} />
          </div>
        </div>
      </div>

      {showNewEvent && (
        <NewEvent
          onClose={() => setShowNewEvent(false)}
          onSave={async (payload) => {
            if (onEventCreated) await onEventCreated(payload);
            else await createEvent(payload);
            await loadEvents();
            setShowNewEvent(false);
          }}
        />
      )}

      {showEventsModal && (
        <EventsModal
          onClose={() => setShowEventsModal(false)}
          onChanged={loadEvents}
        />
      )}
    </>
  );
} 