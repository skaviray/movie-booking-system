import React, {createContext, useReducer} from "react";
import cartReducer,{sumItems} from "./cart-reducer";


const initialState = { cartItems: [], seatCount: 0, totalPrice: 0}
export const CartContext = createContext();
const CartContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(cartReducer, initialState)
    const addSeat = (seat) => dispatch({type: 'ADD_SEAT', payload: seat})
    const deleteSeat = (seat) => dispatch({type: "DELETE_SEAT", payload: seat})
    const contextValues = {
        ...state,
        addSeat,
        deleteSeat
    }
    return (
        <CartContext.Provider value={contextValues} >
            {
                children
            }
        </CartContext.Provider>
    )
}

export default CartContextProvider