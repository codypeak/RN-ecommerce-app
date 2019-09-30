import React from 'react';
import { Text, FlatList, Platform, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart'; //imports all actions. merges all exports from that file into one object.
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
    const products = useSelector(state => state.products.availableProducts);  //this hook automatically takes in state and returns whatever data/slice of state you want from it. 
    const dispatch = useDispatch();

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id, 
            productTitle: title,
        });
    }
    return (
        <FlatList 
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

export default ProductsOverviewScreen;