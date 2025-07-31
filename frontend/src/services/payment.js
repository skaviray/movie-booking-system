import http from "./service";
import config from '../config.json'
export const pay = async (price) => {
    const payload = {
        "amount": price
    }
    console.log(payload)
const res = await http.post(`${config.apiEndpoint}/api/create-order`, payload);
console.log(res.data)
const { id: order_id, amount, currency } = res.data;
const options = {
    key: config.razorpayKEY,
    amount,
    currency,
    order_id,
    name: "My App",
    description: "Movie Ticket Booking",
    handler: async function (response) {
    // send to backend for verification
    await http.post(`${config.apiEndpoint}/api/verify-payment`, {
        order_id: order_id,
        payment_id: response.razorpay_payment_id,
        signature: response.razorpay_signature,
    });
    alert("Payment Success!");
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
