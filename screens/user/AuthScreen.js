import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Button, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux'; //useDispatch to dispatch auth action.

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => { //reusing formReducer from EditProductScreen so could make a reusable component or custom hook. 
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

const AuthScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isSignup, setIsSignup] = useState(false); //determines if we will show login or signup.
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, { //optional 2nd arg is initial state.
        inputValues: { //state changes on every keystroke.
            email: '',
            password: ''
        }, 
        inputValidities: {
           email: false,
           password: false
        }, 
        formIsValid: false
    });

    useEffect(() => {
        if (error) {
            Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]) //error messages in actions.
        }
    }, [error])

    const authHandler = async () => {
        let action;
        if (isSignup) {
            action = authActions.signup(
                formState.inputValues.email, 
                formState.inputValues.password
            );
        } else {
            action = authActions.login(
                formState.inputValues.email,
                formState.inputValues.password
            );
        }
        setError(null); //set back to null before sending request.
        setIsLoading(true);
        try {
            await dispatch(action);
            props.navigation.navigate('Shop'); //if login successful then use ShopNavigator to navigate to ProductsOverview.
        } catch (err) {
            setError(err.message);
            setIsLoading(false); //keep this in catch b/c no need to reload if leaving page. 
        } 
    };

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {  //value and isValid forwarded from Input component
            dispatchFormState({ //allows you to save values input.
                type: FORM_INPUT_UPDATE, 
                value: inputValue, 
                isValid: inputValidity, //forwards only when Input touched.
                input: inputIdentifier
            });
        }, 
        [dispatchFormState]
    );

    return (
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={50} style={styles.screen}>
        <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient} >
            <Card style={styles.authContainer}>
                <ScrollView>
                    <Input 
                        id='email'
                        label='E-mail'
                        keyboardType='email-address'
                        required
                        email
                        autoCapitalize='none'
                        errorText='Please enter a valid email address'
                        onInputChange={inputChangeHandler} //stores input in formState.
                        initialValue=''
                    />
                    <Input 
                        id='password'
                        label='Password'
                        keyboardType='default'
                        secureTextEntry  //forwarded all props to TextInput in Input comp so this is supported.
                        required
                        minLength={5}
                        autoCapitalize='none'
                        errorText='Please enter a valid password'
                        onInputChange={inputChangeHandler}
                        initialValue=''
                    />
                    <View style={styles.buttonContainer}>
                        {isLoading ? (
                            <ActivityIndicator size='small' color={Colors.primary} />
                        ) : (
                            <Button 
                                title={isSignup ? 'Sign Up' : 'Login'}
                                color={Colors.primary} 
                                onPress={authHandler} 
                            />
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button 
                            title={`Switch to ${isSignup ? 'Login' : 'Sign up'}`} 
                            color={Colors.accent} 
                            onPress={() => {
                                setIsSignup(prevState => !prevState);
                            }} 
                        />
                    </View>
                </ScrollView>
            </Card>
        </LinearGradient>
        </KeyboardAvoidingView>
    )
};

AuthScreen.navigationOptions = {
    headerTitle: 'Authenticate'
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },  
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
    },
    buttonContainer: {
        marginTop: 10,
    }
});

export default AuthScreen;

//firebase database rules allows read, but need token to write.
// {
// "rules": {
//     ".read": true,
//     ".write": "auth != null"
//     }
// }