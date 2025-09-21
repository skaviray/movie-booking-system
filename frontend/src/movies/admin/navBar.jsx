import React, { useState } from 'react'
import { NavLink } from 'react-router'
import LocationsDashboard from '../locations/locationsDashboard'
import ScreensDashboard from '../screens/screensDashboard'
import ShowTimesDashboard from '../showtimes/showTimesDashboard'
import GenresDashboard from '../genres/genresDashboard'
import TheatreDashboard from '../theatres/theatreDashboard'
import MoviesDashboard from '../moviesDashboard_fn'

export default function AdminNavbar({user}) {
    const [activeTab,setTab] = useState("movies")
    const handleSelect = (tab) => {
        setTab(tab)
    }
    const renderContent = () => {
        switch (activeTab){
            case "locations": return <LocationsDashboard user={user} />;
            case "screens": return <ScreensDashboard user={user} />;
            case "showtimes": return <ShowTimesDashboard user={user} />;
            case "theatres": return <TheatreDashboard user={user} />;
            case "genres": return <GenresDashboard user={user} />;
            case "users": return <p1>users</p1>;
            case "profile": return <p1>profile</p1>;
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
        <li class="nav-item">
            <button className="nav-link" onClick={() => {handleSelect("profile")}}>Profile</button>
        </li>
        <li class="nav-item">
            <button className="nav-link" onClick={() => {handleSelect("movies")}}>Movies</button>
        </li>
        <li class="nav-item">
            <button className="nav-link" onClick={() => {handleSelect("genres")}}>Genres</button>
        </li>
        <li class="nav-item">
            <button className="nav-link" onClick={() => {handleSelect("showtimes")}}>Showtimes</button>
        </li>
        <li class="nav-item">
            <button className="nav-link" onClick={() => {handleSelect("screens")}}>Screens</button>
        </li>
        <li class="nav-item">
            <button className="nav-link" onClick={() => {handleSelect("theatres")}}>Theatres</button>
        </li>
        <li class="nav-item">
            <button className="nav-link" onClick={() => {handleSelect("locations")}}>Locations</button>
        </li>
        <li class="nav-item">
            <button className="nav-link" onClick={() => {handleSelect("users")}}>Users</button>
        </li>
        </ul>
    </div>
    <div className="flex-grow-1 p-4">{renderContent()}</div>
    </div>
  )
}
