import React from 'react'
import { useNavigate } from 'react-router'

function Cancelled() {
    const navigate = useNavigate()
  return (
        <div className='checkout'>
            <h1> Payment failed</h1>
            <p>Payment was not successful</p>
         <div>
            <button className='nomad-btn is-black' onClick={() => navigate('/')}>
                <div className='text'>Continue Shopping</div>
            </button>
         </div>
        </div>
  )
}

export default Cancelled