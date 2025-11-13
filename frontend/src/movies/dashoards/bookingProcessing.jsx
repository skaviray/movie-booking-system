import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import http from "../services/http";
import config from "../config.json";

const BookingProcessing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { order_id } = location.state || {};

  const [message, setMessage] = useState("Processing your payment...");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!order_id) {
      navigate("/");
      return;
    }

    const interval = setInterval(async () => {
      if (checking) return;
      setChecking(true);

      try {
        const res = await http.get(`${config.apiEndpoint}/api/booking-status`, {
          params: { order_id },
        });

        const data = res.data;

        if (data.status === "success") {
          clearInterval(interval);
          navigate("/booking-success", { state: { booking: data.booking } });
        } else if (data.status === "failed") {
          clearInterval(interval);
          setMessage("Booking failed. Please contact support.");
        }
      } catch (err) {
        console.error("Error checking booking:", err);
      } finally {
        setChecking(false);
      }
    }, 3000); // poll every 3 seconds

    return () => clearInterval(interval);
  }, [order_id, navigate, checking]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-md">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">{message}</h2>
        <p className="text-gray-500 mt-2">This may take a few seconds...</p>
      </div>
    </div>
  );
};

export default BookingProcessing;
