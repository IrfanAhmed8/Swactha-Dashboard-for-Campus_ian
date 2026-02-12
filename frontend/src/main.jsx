import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import Cctv_zone from './Cctv_zone.jsx'
import { ZoneProvider } from './context/ZoneContext.jsx';

createRoot(document.getElementById('root')).render(
  <ZoneProvider>
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
   <Route path="/zone/cctv_zone" element={<Cctv_zone />} />
  </Routes>
  </BrowserRouter>
  </ZoneProvider>

)
