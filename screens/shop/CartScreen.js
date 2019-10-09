import React, {useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'; //to get data out of store.

import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import Card from '../../components/UI/Card';
import * as cartActions from '../../store/actions/cart';
import * as ordersActions from '../../store/actions/orders';

const CartScreen = props => {
    const [isLoading, setIsLoading] = useState(false);

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

    const sendOrderHandler = async () => { //addOrder returns promise, so dispatch returns promise, so can add async here.
        setIsLoading(true);
        await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
        setIsLoading(false);
    }

    return (
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.summeryText}>
                    Total: <Text style={styles.amount}>${Math.round(cartTotalAmount.toFixed(2) * 100) / 100 }</Text> 
                </Text>
                {isLoading ? (
                    <ActivityIndicator size='small' color={Colors.primary}/> 
                ) : (
                    <Button 
                        color={Colors.accent} 
                        title='Order Now' 
                        disabled={cartItems.length === 0} //disabled if nothing in cart.
                        onPress={sendOrderHandler}
                    />
                )}
            </Card>
            <FlatList 
                data={cartItems}
                keyExtractor={item => item.productId} //actually need the extractor in this instance b/c there is no key or id in transformedCartItems
                renderItem={itemData => ( ////need to pass in data to forward as props to CardItem.
                    <CartItem 
                        quantity={itemData.item.quantity}
                        title={itemData.item.productTitle}
                        amount={itemData.item.sum}
                        deletable //this sets delete button to true on CartItem. dont use it on OrderItem so that comp doesnt get button.
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

//Math.round we used bc of way js handles floating points can wind up with -0 after removing items, so this gets rid of that.