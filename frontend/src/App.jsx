import './App.css'

import {Routes, Route} from "react-router-dom"

import Admin from './admin/admin'

import Home from './pages/landing/home/home'
import Tips from './pages/landing/tips/tips'
import DashboardLights from './pages/landing/tips/dashboardLights/dashboardLights'
import FuelSaving from './pages/landing/tips/fuelSaving/fuelSaving'
import ParkingHelp from './pages/landing/tips/parkingHelp/parkingHelp'

import Cars from './pages/car-select/cars/cars'

import Dashboard from './pages/main-page/dashboard/dashboard'
import ServiceLog from './pages/main-page/menu-points/serviceLog/serviceLog'
import Statistics from './pages/main-page/menu-points/statistics/statistics'
import TripsAndFuels from './pages/main-page/menu-points/tripsAndFuels/tripsAndFuels'

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin" element={<Admin />} />

        <Route path="/" element={<Home />} />
        <Route path="/tippek" element={<Tips />} />
        <Route path="/tippek/muszerfal-jelzesek" element={<DashboardLights />} />
        <Route path="/tippek/uzemanyag-sporolas" element={<FuelSaving />} />
        <Route path="/tippek/parkolasi-tippek" element={<ParkingHelp />} />

        <Route path="/autok" element={<Cars />} />

        <Route path="/muszerfal" element={<Dashboard />} />
        <Route path="/szerviznaplo" element={<ServiceLog />} />
        <Route path="/statisztikak" element={<Statistics />} />
        <Route path="/utak-tankolasok" element={<TripsAndFuels />} />
      </Routes>
      
    </>
  )
}

export default App
