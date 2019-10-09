import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Platform, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart'; //imports all actions. merges all exports from that file into one object.
import * as productsActions from '../../store/actions/products';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(); //initially undefined b/c no error.
    const products = useSelector(state => state.products.availableProducts);  //this hook automatically takes in state and returns whatever data/slice of state you want from it. 
    const dispatch = useDispatch();

    const loadProducts = useCallback(async () => { //use async here b/c useEffect cant return a promise but it can return a func that does.
        setError(null); //reset error to null 
        setIsRefreshing(true);
        try {
            await dispatch(productsActions.fetchProducts()); //wait for dispatching to be done for http request and promise to be done. 
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => { //set up a navigation listener b/c if data on server is edited it is not automatically pushed.
        const willFocusSub = props.navigation.addListener('willFocus', loadProducts);  //2nd arg is cbfunc that fires when event occurs. 
        
        return () => { //need clean up func.
            willFocusSub.remove(); //removes when component unmounted.
        };
    }, [loadProducts]);

    useEffect(() => { //will run whenever component loaded. 
        setIsLoading(true);
        loadProducts().then(() => {
            setIsLoading(false);
        });
    }, [dispatch]); //need loadProducts in dependencies?????????

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id, 
            productTitle: title,
        });
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error occurred!</Text>
                <Button title="Try again" onPress={loadProducts} color={Colors.primary} />
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        );
    };

    if (!isLoading && products.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No products founds.  Maybe start adding some.</Text>
            </View>
        );
    };

    return (
        <FlatList 
            onRefresh={loadProducts} //pull to refresh.
            refreshing={isRefreshing} 
            data={products}
            keyExtractor={item => item.id} //dont need this in new versions. RN will look for id as key.
            renderItem={itemData => (
                <ProductItem 
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => {
                        selectItemHandler(itemData.item.id, itemData.item.title)
                        // props.navigation.navigate('ProductDetail', { //2nd arg is js obj that is params for this action.
                        //     productId: itemData.item.id,  //itemData.item points at a single product based on data model which then gets forwarded to detail screen.
                        //     productTitle: itemData.item.title,
                        // });
                    }}
                >
                    <Button 
                        color={Colors.primary} 
                        title='View Details' 
                        onPress={() => {
                            selectItemHandler(itemData.item.id, itemData.item.title)}} 
                    />
                    <Button 
                        color={Colors.primary} 
                        title='To Cart' 
                        onPress={() => {
                            dispatch(cartActions.addToCart(itemData.item))}} 
                    />
                </ProductItem>
            )}
        />
    );
};

ProductsOverviewScreen.navigationOptions = navData => { //when add onpress tocart change to function b/c navData allows navigation prop so we can navigate.
    return { 
        headerTitle: 'All Products',
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item 
                title='Menu' 
                iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} 
                onPress={() => navData.navigation.toggleDrawer()}
            />
            </HeaderButtons>
        ),
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='cart' 
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'} 
                    onPress={() => navData.navigation.navigate('Cart')}
                />
            </HeaderButtons>
        )
    }
};

const styles = StyleSheet.create({
    centered: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
});

export default ProductsOverviewScreen;