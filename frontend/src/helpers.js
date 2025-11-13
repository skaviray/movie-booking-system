const API = "http://localhost:8080"
export const isInCart = (product, cartItems) => {
    return cartItems.find(item => item.id === product.id)
}

export const fetchSessionIdFromApi = async (endpoint, opts) => {
    const {method, body} = { method: "POST", body: null, ...opts}
    console.log(`${API}/${endpoint}`)
    const res = await fetch(`${API}/${endpoint}`, {
        method,
        ...(body ? { body: JSON.stringify(body) } : {}),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    return res.json()

}