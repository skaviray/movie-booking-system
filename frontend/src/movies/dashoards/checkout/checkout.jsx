import React, {useContext} from 'react'
import StripeCheckout from './stripe-checkout/stripeCheckout'
import { CartContext } from '../../context/cartContext'
function Checkout() {
  const {cartItems,seatCount,totalPrice } = useContext(CartContext)
  return (
        <div className="checkout">
            <h2>Order Summary</h2>
            <h3>{`Total Seats: ${seatCount}`}</h3>
            <h4>{`Amount to Pay: $${totalPrice}`}</h4>
            <StripeCheckout />
        </div>
  )
}

export default Checkout