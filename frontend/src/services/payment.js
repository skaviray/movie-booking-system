import http from "./service";
import config from '../config.json'
export const Pay = async (showtime_id,seat_ids,price, customerInfo, navigate) => {
    const payload = {
        "showtime_id": Number(showtime_id),
        "amount": price,
        "seat_ids": seat_ids,
        "customer_id": customerInfo.id 
    }
    console.log(payload)
const res = await http.post(`${config.apiEndpoint}/api/create-order`, payload);
console.log(res.data)
const { order_id, amount, currency } = res.data;
const options = {
    key: config.razorpayKEY,
    amount,
    currency,
    order_id,
    name: "My App",
    description: "Movie Ticket Booking",
    handler: async function (response) {
    // send to backend for verification
  try {
    const verifyRes = await http.post(`${config.apiEndpoint}/api/verify-payment`, {
        order_id: order_id,
        payment_id: response.razorpay_payment_id,
        signature: response.razorpay_signature,
        showtime_id: Number(showtime_id),
        amount: price,
        seat_ids: seat_ids,
        customer_id: customerInfo.id 
    });
    const data = verifyRes.data
    if (data.status === "success") {
        navigate("/booking-success", { state: { booking: data.booking } });
    } else {
        alert("Payment verified but booking failed. Please contact support.");
    }
  } catch (err) {
    console.error("Verification error:", err);
    alert("Payment verification failed. Please try again.");
  }
    },
    prefill: {
    name: "Your Name",
    email: "email@example.com",
    },
    theme: {
    color: "#3399cc",
    },
};

const rzp = new window.Razorpay(options);
rzp.open();
};
