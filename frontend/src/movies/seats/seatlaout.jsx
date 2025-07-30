import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchScreenWithId } from "../../services/screensService";
import { fetchShowTimes,fetchShowTimeById } from "../../services/showTimesService";

export default function SeatLayout() {
    const {id,screen_id,showtime_id } = useParams()
    const [loading,setLoading] = useState(true)
    const [showTime, setShowTime] = useState({})
    const [selectedSeats, setSelectedSeats] = useState([])
    const [seatLayout,setSeatLayout] = useState({})
    useEffect(() => {
      const loadScreen = async () => {
          const fetchedScreen = await fetchScreenWithId(id)
          const fetchedShowTime = await fetchShowTimeById(id)
          setSeatLayout(fetchedScreen)
          setShowTime(fetchedShowTime)
          setLoading(false)
      }
      loadScreen()
    },[])
    // const selectedSeats = ['F1',"F2"]
    const onSelect = (seatId) => {
        console.log("selected", seatId)
        // const selected = 
        setSelectedSeats([...selectedSeats,seatId])
    }
  const renderSeats = () => {
    const layout = [];
    console.log(seatLayout)
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
  return (<div className="seat-layout-wrapper">
      <div className="seat-layout">{renderSeats()}</div>
      <div className="screen " >All eyes this way please</div>
      {selectedSeats.length > 0  && <button className="pay-button">Pay {selectedSeats.length*showTime.price}</button>}
    </div>)
}
