import React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { fetchMovieShowTimes } from '../../services/movieService'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router'

export default function ShowTimesDashboardByMovieId() {
    const {id} = useParams()
    const [allshowTimes, setShowTimes] = useState([])
    const [loading, setLoading] = useState(true)
    const [groupedShowtimes, setGroupedShowtimes] = useState({});
    const [filteredShowtimes, setFilteredShowtimes] = useState({});
    const [selectedDate, setSelectedDate] = useState(() => {
        return new Date().toISOString().slice(0, 10);
    });

    console.log(id)
    // Helper to generate next 7 days
    const getNext7Dates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
    }
    return dates;
    };
    const upcomingDates = getNext7Dates();
    useEffect(() => {
        const loadShowtimes = async () => {
            try {
                const fetchedShowTimes = await fetchMovieShowTimes(id)
                setShowTimes(fetchedShowTimes)
                const grouped = {};
                allshowTimes.forEach((item) => {
                const { theatre_name, start_time, screen_id } = item;
                if (!grouped[theatre_name]) grouped[theatre_name] = []
                grouped[theatre_name].push({ start_time, screen_id })
                }); 
                setGroupedShowtimes(grouped)  
                setLoading(false)          
            } catch (ex) {
                toast.error("Unexpected error occured")
            }
        }
        loadShowtimes()
    },[id])
  useEffect(() => {
    const grouped = {};
    allshowTimes.forEach(({ theatre_name, start_time, screen_id, showtime_id }) => {
      const showDate = start_time.slice(0, 10); // YYYY-MM-DD
      if (showDate === selectedDate) {
        if (!grouped[theatre_name]) grouped[theatre_name] = [];
        grouped[theatre_name].push({ start_time, screen_id, showtime_id });
      }
    });
    setFilteredShowtimes(grouped);
  }, [allshowTimes, selectedDate]);
    if (loading) return null
    console.log(groupedShowtimes)
  return (
    <div className='bookings-dashboard' >
      <div className='datepicker'>
        {upcomingDates.map((date) => {
          const iso = date.toISOString().slice(0, 10);
          const label =
            date.toDateString().slice(0, 3) + ', ' + date.getDate(); // e.g., "Wed, 16"
          return (
            <button
              key={iso}
              onClick={() => setSelectedDate(iso)}
              style={{
                padding: '10px',
                marginRight: '10px',
                background: iso === selectedDate ? '#333' : '#eee',
                color: iso === selectedDate ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                minWidth: '80px',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
      <table className="table table-bordered table-stripe bookings-table">
        <thead>
          <tr>
            <th>Theater</th>
            <th>Showtimes</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(filteredShowtimes).map(([theater, times]) => (
            <tr key={theater}>
              <td>{theater}</td>
              <td>
                {times.map(({ start_time, screen_id, showtime_id }, idx) => (
                  <Link
                    to={`/movies/${id}/screens/${screen_id}/seat-layout/${showtime_id}`}
                    key={idx}
                    style={{ marginRight: '10px', display: 'inline-block' }}
                  >
                    {new Date(start_time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Link>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
