import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { fetchScreenWithId } from "../../services/screensService";
import { fetchShowTimes,fetchShowTimeById } from "../../services/showTimesService";
import { Pay } from "../../services/payment";
import CustomerDetails from "../common/customerDetails";
import { fetchMovieWithId } from "../../services/movieService";
import { fetchTheatres } from '../../services/theatreService';
import { fetchAvailableSeatsForShowTime } from "../../services/showTimesService";
import { fetchLocations } from '../../services/locations';
import { CartContext } from "../context/cartContext";
import Checkout from "./checkout/checkout";
export default function SeatLayout() {
    const navigate = useNavigate()
    const {cartItems,seatCount,totalPrice, addSeat, deleteSeat } = useContext(CartContext)
    const [customerInfo, setCustomerInfo] = useState({})
    const [screen, setScreen] = useState({})
    const [movie, setMovie] = useState()
    const [theatres, setTheatres] = useState([])
    const {id,screen_id,showtime_id } = useParams()
    const [loading,setLoading] = useState(true)
    const [showTime, setShowTime] = useState({})
    const [selectedSeats, setSelectedSeats] = useState([])
    const [selectedSeatsIds, setSelectedSeatsIds] = useState([])
    const [seatLayout,setSeatLayout] = useState({})
    const [locations,setLocations] = useState([])
    const [enableBookingButton, setBookingButton ] = useState(true)
    useEffect(() => {
      const loadScreen = async () => {
          const fetchedLocations = await fetchLocations()
          const fetchedScreen = await fetchScreenWithId(screen_id)
          const fetchedScreenLayout = await fetchAvailableSeatsForShowTime(showtime_id)
          const fetchedMovie = await fetchMovieWithId(id)
          const fetchedShowTime = await fetchShowTimeById(showtime_id)
          const fetchedTheatres = await fetchTheatres()
          setSeatLayout(fetchedScreenLayout)
          setScreen(fetchedScreen)
          setShowTime(fetchedShowTime)
          setMovie(fetchedMovie)
          setTheatres(fetchedTheatres)
          setLocations(fetchedLocations)
          setLoading(false)
      }
      loadScreen()
    },[])
    const onSelect = (seat) => {
        console.log("selected", seat)
        console.log({...seat, amount: showTime.price, currency: "usd", name: seat.seat_name, description: seat.seat_name})
        const seatExists = selectedSeats.find((s) => s === seat.seat_name )
        if (seatExists) {
          const newSelectedSeats = selectedSeats
          const newSelectedSeatIds = selectedSeatsIds
          newSelectedSeats.pop(seat.seat_name)
          newSelectedSeatIds.pop(seat.seat_id)
          setSelectedSeats([...newSelectedSeats])
          setSelectedSeatsIds([...newSelectedSeatIds])
          deleteSeat({...seat, amount: showTime.price, currency: "usd", name: seat.seat_name, description: `${seat.seat_name}`})
        } else {
          setSelectedSeats([...selectedSeats,seat.seat_name])
          setSelectedSeatsIds([...selectedSeatsIds,seat.seat_id])
          addSeat({...seat, amount: showTime.price, currency: "usd", name: seat.seat_name, description: `${seat.seat_name}`})
        }
    }
const renderSeats = () => {
  const layout = [];

  for (let i = 0; i < seatLayout.length; i += screen.columns) {
    const rowSeats = seatLayout.slice(i, i + screen.columns);

    layout.push(
      <div className="seat-map">
        {rowSeats.map((seat) => {
          const isSelected = selectedSeats.includes(seat.seat_name);
          const isAvailable = seat.status === "available";

          const className = `
            seat 
            ${isSelected ? "selected" : ""}
            ${!isAvailable ? "booked" : ""}
          `;

          return (
            <button
              key={seat.seat_name}
              className={className}
              disabled={!isAvailable}
              onClick={() => onSelect(seat)}
            >
              {seat.seat_name}
            </button>
          );
        })}
      </div>
    );
  }

  return layout;
};

  if (loading) return null

  // console.log(selectedSeats,selectedSeatsIds)
  // console.log("hello")
  const showDate = new Date(showTime.start_time)
  const theatre = theatres.find(theatre => theatre.id === screen.theater_id)
  const location = locations.find(location => location.id === theatre.location)
  console.log(cartItems)
  console.log(totalPrice)
  console.log(seatCount)
  return (
    <div style={{height: "100%", width: "100%"}}>
      <div className="seatlayout-supercontainer">
        <div className="seat-layout-wrapper">
          <CustomerDetails setCustomerInfo={setCustomerInfo} enableBookingButton={setBookingButton} />
          <div className="seat-layout">{renderSeats()}</div>
          <div className="screen " >All eyes this way please</div>
          {/* {selectedSeats.length > 0  && <button className="pay-button btn btn-success" disabled={enableBookingButton} onClick={() => Pay(showtime_id,selectedSeatsIds,parseFloat(selectedSeats.length*showTime.price*100), customerInfo, navigate)}>Pay {selectedSeats.length*showTime.price}</button>} */}
          {selectedSeats.length > 0  && <button className="pay-button btn btn-success" disabled={enableBookingButton} onClick={() => navigate('/checkout')} >Pay {selectedSeats.length*showTime.price}</button>}
          <div className="seat-layout-references">
            <div className="seat-wrapper"><div className="seat"></div><span className="seat-label">Available</span></div>
            <div className="seat-wrapper"><div className="seat booked"></div><span className="seat-label">Booked</span></div>
            <div className="seat-wrapper"><div className="seat selected"></div><span className="seat-label">Selected</span></div>
          </div>
        </div>
        <div className="seatlayout-summary">
        <div class="order-summary-wrapper">
          <div class="order-summary-header">
            <div class="order-title">ORDER SUMMARY</div>
            <div class="ticket-count">{selectedSeats.length}<span>Tickets</span>
            </div>
          </div>

          <div class="movie-title">{movie.title}</div>
          <div class="movie-certification">{movie.language}</div>
          <div class="theater-info">{theatre.theatre_name} ({screen.name})</div>
          <div class="theater-info">{location.address}</div>
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
