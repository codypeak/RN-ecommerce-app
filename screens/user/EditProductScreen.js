import React, { useState, useEffect, useCallback } from 'react'; //useState to save user input. effect and callback for submit.
import { View, Text, StyleSheet, ScrollView, TextInput, Platform } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';  //reach out to product state to populate form for edit.

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';

const EditProductScreen = props => {
    const prodId = props.navigation.getParam('productId'); //if receive prodId it is in edit mode, so prepopulate form.
    const editedProduct = useSelector(state =>
        state.products.userProducts.find(prod => prod.id === prodId) //if there is no id it is undefined and nothing is populated.
    ); //do this first so can initialize screen with or without populated form.
    const dispatch = useDispatch();

    const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
    const [imageUrl, setImageUrl] = useState(editedProduct ? editedProduct.imageUrl : '');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState(editedProduct ? editedProduct.description : '');

    const submitHandler = useCallback(() => { //uCB will prevent re-rendering that will cause infinite loop.
        if (editedProduct) { //if editedProduct is set (ie theres an id), then submit will edit, else add.
            dispatch(productsActions.updateProduct(prodId, title, description, imageUrl));
        } else {
            dispatch(productsActions.createProduct(title, description, imageUrl, +price)); // + converts price from string to number.
        }
    }, [dispatch, prodId, title, description, imageUrl, price]);

    useEffect(() => {
        props.navigation.setParams({ submit: submitHandler});
    }, [submitHandler]); //to execute after render cycle.

    return (
        <ScrollView>
            <View style={styles.form}>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput style={styles.input} value={title} onChangeText={text => setTitle(text)} />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Image URL</Text>
                    <TextInput style={styles.input} value={imageUrl} onChangeText={text => setImageUrl(text)} />
                </View>
                {editedProduct ? null : ( //because DO NOT allow editing price.
                    <View style={styles.formControl}>
                        <Text style={styles.label}>Price</Text>
                        <TextInput style={styles.input} value={price} onChangeText={text => setPrice(text)} />
                    </View>
                )}
                <View style={styles.formControl}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput style={styles.input} value={description} onChangeText={text => setDescription(text)} />
                </View>
            </View>
        </ScrollView>
    )
};

EditProductScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit'); //once setParam in useEffect, can get it here. 
    return {
        headerTitle: navData.navigation.getParam('productId') 
        ? 'Edit Product' //from UserProductScreen if parameter has id then show Edit, if not show Add.
        : 'Add Product',
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='Save' 
                    iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'} 
                    onPress={submitFn}
                />
            </HeaderButtons>
        )
    };
};

const styles = StyleSheet.create({
    form: {
        margin: 20,
    },
    formControl: {
        width: '100%',
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8,
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
});

export default EditProductScreen;
