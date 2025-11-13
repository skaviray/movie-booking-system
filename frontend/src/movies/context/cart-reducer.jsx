export const sumItems = (cartItems) => {
    return {
        seatCount: cartItems.reduce((total,prod) =>  total + prod.quantity, 0),
        totalPrice: cartItems.reduce((total, prod) => total + (prod.amount * prod.quantity), 0)
    }
}
const cartReducer = (state, action) => {
    switch(action.type) {
        case 'ADD_SEAT':
            if (!state.cartItems.find(item => item.seat_id === action.payload.seat_id)){
                state.cartItems.push({
                    ...action.payload, 
                    quantity: 1})
            }             
            return {
                ...state,
                cartItems: [...state.cartItems],
                ...sumItems([...state.cartItems])
            }
        case 'DELETE_SEAT':
            const product = state.cartItems.find(prod => prod.seat_id === action.payload.seat_id)
            if (product) {
                const reducedCart = state.cartItems.filter(prod => prod.seat_id !== product.seat_id)
                const updatedCart = [...reducedCart]
                return {
                    ...state,
                    cartItems: updatedCart,
                    ...sumItems(updatedCart)
                }
            }
        default:
            return state
    }
}


export default cartReducer