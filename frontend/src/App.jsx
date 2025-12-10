import './App.css'

import {Routes, Route} from "react-router-dom"

import Admin from './admin/admin'

import Home from './pages/landing/home/home'
import Tips from './pages/landing/tips/tips'
import DashboardLights from './pages/landing/tips/dashboardLights/dashboardLights'
import FuelSaving from './pages/landing/tips/fuelSaving/fuelSaving'
import ParkingHelp from './pages/landing/tips/parkingHelp/parkingHelp'

import Dashboard from './pages/main-page/dashboard/dashboard'
import Events from './pages/main-page/events/events'
import NewFuel from './pages/main-page/newFuel/newFuel'
import NewTrip from './pages/main-page/newTrip/newTrip'

import ServiceLog from './pages/main-page/menu-points/serviceLog/serviceLog'
import Statistics from './pages/main-page/menu-points/statistics/statistics'
import TripsAndFuels from './pages/main-page/menu-points/tripsAndFuels/tripsAndFuels'

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin" element={<Admin />} />

        <Route path="/" element={<Home />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/tips/dashboardLights" element={<DashboardLights />} />
        <Route path="/tips/fuelSaving" element={<FuelSaving />} />
        <Route path="/tips/parkingHelp" element={<ParkingHelp />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/newFuel" element={<NewFuel />} />
        <Route path="/newTrip" element={<NewTrip />} />

        <Route path="/serviceLog" element={<ServiceLog />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/tripsAndFuels" element={<TripsAndFuels />} />
      </Routes>
      
    </>
  )
}

export default App