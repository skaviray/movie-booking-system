import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchScreenWithId } from "../../services/screensService";
import { fetchShowTimes,fetchShowTimeById } from "../../services/showTimesService";
import { pay } from "../../services/payment";
import CustomerDetails from "./customerDetails";
import { fetchMovieWithId } from "../../services/movieService";
import { fetchTheatres } from '../../services/theatreService';

export default function SeatLayout() {
    const {email,setEmail} = useState()
    const {mobile, setMobile} = useState()
    const [movie, setMovie] = useState()
    const [theatres, setTheatres] = useState([])
    const {id,screen_id,showtime_id } = useParams()
    const [loading,setLoading] = useState(true)
    const [showTime, setShowTime] = useState({})
    const [selectedSeats, setSelectedSeats] = useState([])
    const [seatLayout,setSeatLayout] = useState({})
    useEffect(() => {
      const loadScreen = async () => {
          const fetchedScreen = await fetchScreenWithId(id)
          const fetchedMovie = await fetchMovieWithId(id)
          const fetchedShowTime = await fetchShowTimeById(id)
          const fetchedTheatres = await fetchTheatres()
          setSeatLayout(fetchedScreen)
          setShowTime(fetchedShowTime)
          setMovie(fetchedMovie)
          setTheatres(fetchedTheatres)
          setLoading(false)
      }
      loadScreen()
    },[])
    // const selectedSeats = ['F1',"F2"]
    const onSelect = (seatId) => {
        console.log("selected", seatId)
        // const selected = 
        const seat = selectedSeats.find((seat) => seat === seatId )
        if (seat) {
          const newselectedSites = selectedSeats
          newselectedSites.pop(seat)
          setSelectedSeats([...newselectedSites])
        } else {
          setSelectedSeats([...selectedSeats,seatId])
        }
    }
  const renderSeats = () => {
    const layout = [];

    for (let r = 0; r < seatLayout.rows; r++) {
      const row = [];
      for (let c = 0; c < seatLayout.cols; c++) {
        const seatId = `${String.fromCharCode(65 + r)}${c + 1}`;
        const isSelected = selectedSeats.includes(seatId);
        row.push(
          <button
            key={seatId}
            className={`seat ${isSelected ? "selected" : ""}`}
            onClick={() => onSelect(seatId)}
          >
            {seatId}
          </button>
        );
      }
      layout.push(
        <div className="seat-row" key={`row-${r}`}>
          {row}
        </div>
      );
    }
    return layout;
  };
  if (loading) return null
  console.log(selectedSeats)
  console.log(screen_id,showtime_id)
  console.log(showTime)
  console.log(seatLayout)
  const showDate = new Date(showTime.start_time)
  console.log(theatres)
  const theatre = theatres.find(theatre => theatre.id === seatLayout.theater_id)
  return (
    <div style={{height: "100%", width: "100%"}}>
      <div className="seatlayout-supercontainer">
        <div className="seat-layout-wrapper">
          <CustomerDetails email={setEmail} mobile={setMobile} />
          <div className="seat-layout">{renderSeats()}</div>
          <div className="screen " >All eyes this way please</div>
          {selectedSeats.length > 0  && <button className="pay-button btn btn-success" onClick={() => pay(selectedSeats.length*showTime.price)}>Pay {selectedSeats.length*showTime.price}</button>}
        </div>
        <div className="seatlayout-summary">
        <div class="order-summary-wrapper">
          <div class="order-summary-header">
            <div class="order-title">ORDER SUMMARY</div>
            <div class="ticket-count">
              2<span>Tickets</span>
            </div>
          </div>

          <div class="movie-title">{movie.title}</div>
          <div class="movie-certification">{movie.language}</div>
          <div class="theater-info">{theatre.name} ({seatLayout.name})</div>
          <div class="ticket-type">M-Ticket</div>
          <div class="ticket-details">Seats: {selectedSeats.join(',')}</div>
          <div class="show-date">Date: {showDate.toLocaleString()}</div>
          {/* <div class="show-time">11:00 PM</div> */}
        </div>

        </div>
      </div>
    </div>
    
  )
}
