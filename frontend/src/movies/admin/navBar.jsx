import React, { useState } from 'react'
import LocationsDashboard from '../dashoards/locationsDashboard'
import ScreensDashboard from '../dashoards/screensDashboard'
import ShowTimesDashboard from '../dashoards/showTimesDashboard'
import TheatreDashboard from '../dashoards/theatreDashboard'
import MoviesDashboard from '../dashoards/moviesDashboard'

export default function AdminNavbar({user}) {
    const [activeTab,setActiveTab] = useState("movies")
    const handleSelect = (tab) => {
        setActiveTab(tab)
    }
    const renderContent = () => {
        switch (activeTab){
            case "locations": return <LocationsDashboard user={user} />;
            case "screens": return <ScreensDashboard user={user} />;
            case "showtimes": return <ShowTimesDashboard user={user} />;
            case "theatres": return <TheatreDashboard user={user} />;
            case "users": return <p1>users</p1>;
            // case "profile": return <ProfilePage />;
            default: return <MoviesDashboard user={user} />;
        }
        
    }
  return ( 
    <div className="d-flex" style={{ width: "100%", margin: 0 }}>
    <div
        className="nav-bar bg-light border-end p-3"
        style={{ width: "220px", minHeight: "100vh" }}
    >
        <ul class="nav flex-column">
        {/* <li class="nav-item">
            <button className={`nav-link ${activeTab === "profile" ? "active" : ""}`}onClick={() => {handleSelect("profile")}}>Profile</button>
        </li> */}
        <li class="nav-item">
            <button className={`nav-link ${activeTab === "movies" ? "active" : ""}`}onClick={() => {handleSelect("movies")}}>Movies</button>
        </li>
        <li class="nav-item">
            <button className={`nav-link ${activeTab === "showtimes" ? "active" : ""}`}onClick={() => {handleSelect("showtimes")}}>Showtimes</button>
        </li>
        <li class="nav-item">
            <button className={`nav-link ${activeTab === "screens" ? "active" : ""}`}onClick={() => {handleSelect("screens")}}>Screens</button>
        </li>
        <li class="nav-item">
            <button className={`nav-link ${activeTab === "theatres" ? "active" : ""}`}onClick={() => {handleSelect("theatres")}}>Theatres</button>
        </li>
        <li class="nav-item">
            <button className={`nav-link ${activeTab === "locations" ? "active" : ""}`}onClick={() => {handleSelect("locations")}}>Locations</button>
        </li>
        <li class="nav-item">
            <button className={`nav-link ${activeTab === "users" ? "active" : ""}`}onClick={() => {handleSelect("users")}}>Users</button>
        </li>
        </ul>
    </div>
    <div className="flex-grow-1 p-4">{renderContent()}</div>
    </div>
  )
}
