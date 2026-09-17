"use client"
import { useState } from 'react'

export default function LocationPage() {
  const [city, setCity] = useState('Karachi')
  const [saved, setSaved] = useState(false)
  return <div className="container page">
    <p className="eyebrow">Delivery preference</p><h1 className="page-title">Choose your demo location</h1><p className="page-subtitle">This selection is for the NexCart demo only. We do not use real geolocation or request an address.</p>
    <section className="location-card section"><label>Country / region<select defaultValue="Pakistan"><option>Pakistan</option><option>United Arab Emirates</option><option>United Kingdom</option></select></label><label>City<input value={city} onChange={(event) => setCity(event.target.value)} /></label><div className="city-options"><button type="button" onClick={() => setCity('Karachi')}>Karachi</button><button type="button" onClick={() => setCity('Lahore')}>Lahore</button><button type="button" onClick={() => setCity('Islamabad')}>Islamabad</button></div><button type="button" className="button" onClick={() => setSaved(true)}>Apply demo location</button>{saved && <p className="added-note" role="status">Delivery preference updated to {city || 'Pakistan'}.</p>}</section>
  </div>
}
