import React, {useContext, useEffect, useState} from 'react'
import { useStripe } from '@stripe/react-stripe-js'
import { fetchSessionIdFromApi } from '../../../../helpers'
import { CartContext } from '../../../context/cartContext'
function StripeCheckout() {
    const {cartItems, totalPrice} = useContext(CartContext)
    console.log(cartItems)
    const [email, setEmail] = useState('')
    const items = [{
        amount: totalPrice,
        currency: "usd",
        quantity: 1,
        name: "Movie tickets",
        description: "Movie tickets for OG"

    }]
    const stripe = useStripe()
    const seatIds = cartItems.map(s => s.seat_id).join(',');
    const metadata = {
        seats: seatIds,
        showtime: "1",
        screen_id: "1",
        amount: totalPrice.toString(),
        movie: "OG"
    }
    const handleGuestCheckout = async (e) => {
        e.preventDefault()
        const response = await fetchSessionIdFromApi("api/payment", {
            body: {
                success_url: "http://localhost:3000/success",
                cancel_url: "http://localhost:3000/cancel",
                items: items,
                customer_email: email,
                metadata: metadata
            }
        })
        const {url} = response 
        console.log(url)
        window.location.href = url;
    }
  return (
    <form onSubmit={handleGuestCheckout}>
        <div>
            <input 
            type='email'
            onChange={e => setEmail(e.target.value)}
            placeholder='Email'
            value={email}
            className='nomad-input'
            />
        </div>
        <div className='submit-btn'>
            <button type='submit' className='nomad-btn is-black submit'>
                <div className='text'>Checkout</div>
            </button>
        </div>
    </form>
  )
}

export default StripeCheckout