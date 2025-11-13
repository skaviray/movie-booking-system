import { CheckCircle } from "lucide-react";

export default function BookingSuccess({ booking }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Booking Confirmed 🎉
      </h1>
      <p className="text-gray-600 mb-6">
        Thank you, {booking.customer_name}! Your seats are confirmed.
      </p>

      <div className="bg-white shadow-md rounded-2xl p-6 w-96 text-left">
        <p><strong>Booking ID:</strong> #{booking.id}</p>
        <p><strong>Showtime:</strong> {new Date(booking.created_at).toLocaleString()}</p>
        <p><strong>Seats:</strong> {booking.seats.join(", ")}</p>
        <p><strong>Total Price:</strong> ₹{booking.price}</p>
      </div>

      <button
        onClick={() => window.print()}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        Download Ticket
      </button>
    </div>
  );
}
