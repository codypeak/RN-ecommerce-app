import { ADD_ORDER } from '../actions/orders';
import Order from '../../models/orders';

const initialState = {
    orders: []
};

export default (state = initialState, action) => {
    switch(action.type) {
        case ADD_ORDER: 
            const newOrder = new Order(
                new Date().toString(), //creates almost unique order id.
                action.orderData.items, 
                action.orderData.amount,
                new Date()  //js timestamp for date of order.
            ); 
        return {
            ...state,
            orders: state.orders.concat(newOrder)  //returns new array with newOrder added.    
        }
    }
    return state;
};