import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { ADD_ORDER } from '../actions/orders';
import CartItem from '../../models/cart-item';

const initialState = {
    items: {},
    totalAmount: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.product;
            const prodPrice = addedProduct.price;
            const prodTitle = addedProduct.title;

            let updatedOrNewCartItem;

            if (state.items[addedProduct.id]) { //items is obj on state and addProduct.id is a key in that obj.
                //if returns something truish, then already have item in cart. and need to update it by adding another.
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    prodPrice, //price never changes in this app.
                    prodTitle,
                    state.items[addedProduct.id].sum + prodPrice,
                );
            } else {
                updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice); //according to data model.
            }
            return {
                ...state, //in this case we are always updating both pieces of state so dont really have to spread in state in general unless add more properties. 
                items: {...state.items, [addedProduct.id]: updatedOrNewCartItem}, //id is the key in the obj, and newCartItem is its value.
                totalAmount: state.totalAmount + prodPrice,
            };
        case REMOVE_FROM_CART:
            const selectedCartItem = state.items[action.pid];
            const currentQty = selectedCartItem.quantity;
            let updatedCartItems;

            if (currentQty > 1) {
                const updatedCartItem = new CartItem(
                    selectedCartItem.quantity -1,
                    selectedCartItem.productPrice, 
                    selectedCartItem.productTitle,
                    selectedCartItem.sum - selectedCartItem.productPrice
                );
                updatedCartItems = { ...state.items, [action.pid]: updatedCartItem}
            } else {
                updatedCartItems = { ...state.items }; //clones cart.
                delete updatedCartItems[action.pid];  //deletes/removes item from that copy/clone.
            }
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - selectedCartItem.productPrice
            }
        case ADD_ORDER: //include add order here so we can clear the cart when order placed. 
            return initialState;
    }
    return state;
};