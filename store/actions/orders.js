export const ADD_ORDER = 'ADD_ORDER';

export const addOrder = (cartItems, totalAmount) => { //takes in both properties of cart state.
    return { type: ADD_ORDER, orderData: { items: cartItems, amount: totalAmount }} //merge those properties into one object.
};


//handle orders in both orders and cart reducers. 