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
import { createEvent } from "../../../../actions/serviceLog/serviceLogActions";
import { getCars } from "../../../../actions/cars/carsActions";
import { getGeneralStats } from "../../../../actions/stats/statsActions";
import {
  getCurrentUserMeta,
  isCommunityEnabledForCar,
  removeCommunityProfile,
  setCommunityEnabledForCar,
  upsertCommunityProfile,
} from "../../../../actions/community/communityLocalActions";

import "./menu.css";

export default function Menu({ events = [], onEventCreated }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [loadedEvents, setLoadedEvents] = useState([]);
  const [communityEnabled, setCommunityEnabled] = useState(false);
  const [savingCommunity, setSavingCommunity] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  const closeMenu = () => setIsOpen(false);
  const menuEvents = events.length > 0 ? events : loadedEvents;
  const selectedCarId = Number(localStorage.getItem("selected_car_id") || 0);
  const { userId, fullName } = getCurrentUserMeta();
  const isCommunityRoute = location.pathname === "/muszerfal/kozosseg";

  async function loadEvents() {
    try {
      const data = await getDashboard();
      setLoadedEvents(data?.events?.items || []);
    } catch {
      setLoadedEvents([]);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEvents();
    }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userId || !selectedCarId) {
        setCommunityEnabled(false);
        return;
      }
      setCommunityEnabled(isCommunityEnabledForCar(userId, selectedCarId));
    }, 0);
    return () => clearTimeout(timer);
  }, [userId, selectedCarId, location.pathname, refreshTick]);

  async function handleCommunityToggle(event) {
    event.stopPropagation();
    if (isCommunityRoute || savingCommunity || !selectedCarId || !userId) return;

    const enabled = !!event.target.checked;
    setSavingCommunity(true);
    setCommunityEnabledForCar(userId, selectedCarId, enabled);
    setRefreshTick((value) => value + 1);

    if (!enabled) {
      removeCommunityProfile(userId, selectedCarId);
      setSavingCommunity(false);
      return;
    }

    try {
      const [cars, general] = await Promise.all([getCars(), getGeneralStats()]);
      const car = cars.find((item) => Number(item.car_id) === selectedCarId);
      const distance = Number(general?.distance_km_total || 0);
      const liters = Number(general?.fuelings?.liters || 0);
      const spent = Number(general?.fuelings?.spent || 0);
      const pricePerKm = distance > 0 ? Number((spent / distance).toFixed(1)) : 0;

      upsertCommunityProfile({
        userId,
        fullName,
        carId: selectedCarId,
        carName: car?.display_name || general?.car?.display_name || "-",
        licensePlate: car?.license_plate || general?.car?.license_plate || "-",
        carImage: car?.car_image || null,
        stats: { distance, liters, spent, pricePerKm },
      });
    } catch {
      // Keep persisted toggle state even if stat refresh fails.
    } finally {
      setSavingCommunity(false);
      setRefreshTick((value) => value + 1);
    }
  }

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
            className={({ isActive }) => `menu-item ${isActive ? "menu-item-active" : ""}`}
            to={communityEnabled ? "/muszerfal/kozosseg" : "#"}
            onClick={(e) => {
              if (!communityEnabled) {
                e.preventDefault();
                return;
              }
              closeMenu();
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
          <div>
            <h3>Események</h3>
            <hr className="my-2 mx-3" />
          </div>

          <div className="menu-events-content overflow-auto">
            {menuEvents.length > 0 ? (
              menuEvents.map((event) => (
                <EventItem key={event.maintenance_id} title={event.part_name || "Esemény"} reminder={event.reminder} />
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
            if (onEventCreated) {
              await onEventCreated(payload);
            } else {
              await createEvent(payload);
            }
            await loadEvents();
            setShowNewEvent(false);
          }}
        />
      )}
    </>
  );
}
