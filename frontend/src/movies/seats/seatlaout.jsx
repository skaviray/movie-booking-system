import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchScreenWithId } from "../../services/screensService";

export default function SeatLayout() {
    const {id} = useParams()
    // const [screen,setScreen] = useState({})
    const [loading,setLoading] = useState(true)
    const [seatLayout,setSeatLayout] = useState({})
    useEffect(() => {
      const loadScreen = async () => {
          const fetchedScreen = await fetchScreenWithId(id)
          setSeatLayout(fetchedScreen)
          setLoading(false)
      }
      loadScreen()
    },[])
    const selectedSeats = ['F1',"F2"]
    const onSelect = (seatId) => {
        console.log("selected", seatId)
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
  return (<div className="seat-layout-wrapper">
      <div className="seat-layout">{renderSeats()}</div>
      <div className="screen " >SCREEN</div>
    </div>)
}
