import React from 'react';
import { ScrollView, Text, View, Image, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import * as cartActions from '../../store/actions/cart';

const ProductDetailScreen = props => {
    const productId = props.navigation.getParam('productId'); //getting param from ProductOverview
    const selectedProduct = useSelector(state => 
        state.products.availableProducts.find(prod => prod.id === productId));  //products from rootReducer and from their can get any slice of its state. 
    //returns true if id if prod im looking at is equal to productId extracted from route parameters.
    const dispatch = useDispatch();

    return (
        <ScrollView>
            <Image style={styles.image} source={{uri: selectedProduct.imageUrl}} />
            <View style={styles.actions}>
                <Button color={Colors.primary} title='Add To Cart' onPress={() => dispatch(cartActions.addToCart(selectedProduct))} />
            </View>
            <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
            <Text style={styles.description}>{selectedProduct.description}</Text>
        </ScrollView>
    );
};

ProductDetailScreen.navigationOptions = navData => { //in functional form because need to extract data dynamically.
    return {
        headerTitle: navData.navigation.getParam('productTitle')
    };
};

const styles = StyleSheet.create({  
    image: {
        width: '100%',
        height: 300,
    },
    actions: {
        marginVertical: 10,
        alignItems: 'center',
    },
    price: {
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: 'open-sans-bold',
    },
    description: {
        fontFamily: 'open-sans',
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20,
    }
});

export default ProductDetailScreen;