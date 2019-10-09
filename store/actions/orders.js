import Order from '../../models/orders';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
    return async dispatch => {
        try {
            const response = await fetch('https://rn-ecommerce-app-d521a.firebaseio.com/orders/u1.json');

            if (!response.ok) {  //ok is a field available on response object. returns true if response is a 200.
                throw new Error('Something went wrong!');
            }
            const resData = await response.json();
            const loadedOrders = [];

            for (const key in resData) { //map product object data to product array.
                loadedOrders.push(new Order(
                    key,
                    resData[key].cartItems,
                    resData[key].totalAmount,
                    new Date(resData[key].date) //need to recreate date b/c resData comes back with date string.
                )
            );
        }
        dispatch ({ type: SET_ORDERS, orders: loadedOrders });
    } catch (err) {
        throw err;
    }
}
};

export const addOrder = (cartItems, totalAmount) => { //takes in both properties of cart state.
    return async dispatch => {
        const date = new Date();
        const response = await fetch(`https://rn-ecommerce-app-d521a.firebaseio.com/orders/u1.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cartItems,
                totalAmount,
                date: date.toISOString(), //creates date locally in app and then stores to server.
            })
        });

        if (!response.ok) {
            throw new Error('Something went wrong.')
        }

        const resData = await response.json();

        dispatch({ 
            type: ADD_ORDER, 
            orderData: { 
                id: resData.name, 
                items: cartItems, 
                amount: totalAmount, //merge those properties into one object.
                date: date 
            } 
        }); 
    };
};


//handle orders in both orders and cart reducers. 