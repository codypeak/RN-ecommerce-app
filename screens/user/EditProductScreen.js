import React, { useState, useEffect, useCallback, useReducer } from 'react'; //useState to save user input. effect and callback for submit.
import { View, Text, StyleSheet, ScrollView, TextInput, Platform, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';  //reach out to product state to populate form for edit. useDispatch much easier to manage form state than doing each line individually with useState.

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value //dynamic key value pairs from dispatchFormState.
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) { //loop through each updatedValidity by key to check every form input if they are valid/true then form is valid, 
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]; //but if one is false the whole form is invalid.
        };
        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues,
        };
    }
    return state;
};

const EditProductScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const prodId = props.navigation.getParam('productId'); //if receive prodId it is in edit mode, so prepopulate form.
    const editedProduct = useSelector(state =>
        state.products.userProducts.find(prod => prod.id === prodId) //if there is no id it is undefined and nothing is populated.
    ); //do this first so can initialize screen with or without populated form.
    const dispatch = useDispatch();
    //sets initial state that will change when actions dispatched, ie triggered by typing input.
    const [formState, dispatchFormState] = useReducer(formReducer, { //optional 2nd arg is initial state.
        inputValues: { //state changes on every keystroke.
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''
        }, 
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false,
        }, 
        formIsValid: editedProduct ? true : false
    });

    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
        }
    }, [error]);

    const submitHandler = useCallback(async () => { //uCB will prevent re-rendering that will cause infinite loop.
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors on the form', [
                { text: 'Okay' }
            ]);
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            if (editedProduct) { //if editedProduct is set (ie theres an id), then submit will edit, else add.
                await dispatch(productsActions.updateProduct(
                    prodId, 
                    formState.inputValues.title, 
                    formState.inputValues.description, 
                    formState.inputValues.imageUrl
                    )
                );
            } else {
                await dispatch(productsActions.createProduct(
                    formState.inputValues.title, 
                    formState.inputValues.description, 
                    formState.inputValues.imageUrl, 
                    +formState.inputValues.price // + converts price from string to number.
                    )
                );
            }
        props.navigation.goBack();
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, prodId, formState]);

    useEffect(() => {
        props.navigation.setParams({ submit: submitHandler});
    }, [submitHandler]); //to execute after render cycle.

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {  //value and isValid forwarded from Input component
        dispatchFormState({ 
            type: FORM_INPUT_UPDATE, 
            value: inputValue, 
            isValid: inputValidity, //forwards only when Input touched.
            input: inputIdentifier
        });
    }, [dispatchFormState]);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={{flex: 1}} //this is important bc KeyboardAvoidingView needs whole screen size.
            behavior='padding' 
            keyboardVerticalOffset={100}
        >
        <ScrollView>
            <View style={styles.form}>
                <Input 
                    id='title' //forward these as id's to input to avoid using bind here which was causing infinite loop.
                    label='Title'
                    errorText='Please enter a valid title'
                    keyboardType='default'
                    autoCapitalize='sentences'
                    autoCorrect
                    returnKeyType='next'
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.title : ''} //would something like inputValues[key] work and be DRYer?
                    initiallyValid={!!editedProduct} //if editedProduct exists it is true.
                    required
                />
                <Input 
                    id='imageUrl'
                    label='Image URL'
                    errorText='Please enter a valid image URL'
                    keyboardType='default'
                    returnKeyType='next'
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.imageUrl : ''} 
                    initiallyValid={!!editedProduct} 
                    required
                />
                {editedProduct ? null : ( //because DO NOT allow editing price.
                    <Input 
                        id='price'
                        label='Price'
                        errorText='Please enter a valid price'
                        keyboardType='decimal-pad'
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        required
                        min={0.1}
                    />
                )}
                <Input 
                    id='description'
                    label='Description'
                    errorText='Please enter a valid description'
                    keyboardType='default'
                    autoCapitalize='sentences'
                    autoCorrect
                    multiline
                    numberOfLines={3}
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.description : ''} 
                    initiallyValid={!!editedProduct} 
                    required
                    minLength={5}
                />
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default EditProductScreen;
