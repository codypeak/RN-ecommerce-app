import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'; //to get data out of store.

import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import * as cartActions from '../../store/actions/cart';
import * as ordersActions from '../../store/actions/orders';

const CartScreen = props => {
    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => { //more useful to return array here, rather than obj, so transform it bc easier to use in FlatList. also can check array length to enable order now button.
        const transformedCartItems = [];
        for (const key in state.cart.items) { //for each item in cart
            transformedCartItems.push({  //add each item to new array. ie push a js obj into it.
                productId: key, //named productId b/c product id in cart items object stored as a key.
                productTitle: state.cart.items[key].productTitle, //from useSelector state, cart identifier in rootReducer, items in cart reducer for a given key title.
                productPrice: state.cart.items[key].productPrice, //careful product and title have different identifiers in products v cart data models.
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum
            }); //similar to data model but with addition of key.
        }
        return transformedCartItems.sort((a,b) => //need to sort to prevent order of items in cart changing if something removed.
            a.productId > b.productId ? 1 : -1 //sort returns a number.
        );
    });
    const dispatch = useDispatch();

    return (
        <View style={styles.screen}>
            <View style={styles.summary}>
                <Text style={styles.summeryText}>
                    Total: <Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
                </Text>
                <Button 
                    color={Colors.accent} 
                    title='Order Now' 
                    disabled={cartItems.length === 0} //disabled if nothing in cart.
                    onPress={() => dispatch(ordersActions.addOrder(cartItems, cartTotalAmount))}
                />
            </View>
            <FlatList 
                data={cartItems}
                keyExtractor={item => item.productId} //actually need the extractor in this instance b/c there is no key or id in transformedCartItems
                renderItem={itemData => ( ////need to pass in data to forward as props to CardItem.
                    <CartItem 
                        quantity={itemData.item.quantity}
                        title={itemData.item.productTitle}
                        amount={itemData.item.sum}
                        onRemove={() => dispatch(cartActions.removeFromCart(itemData.item.productId))}
                    />
                )}  
            />
        </View>
    )
};

CartScreen.navigationOptions = {
    headerTitle: 'Your Cart'
};

const styles = StyleSheet.create({
    screen: {
        margin: 20,

    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    summeryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
    },
    amount: {
        color: Colors.primary,
    },
});

export default CartScreen;