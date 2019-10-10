import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, AsyncStorage } from 'react-native';
import { useDispatch } from 'react-redux'; //to dispatch authenticate

import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';

const StartupScreen = props => {
    const dispatch = useDispatch();

    useEffect(() => { //check async storage for valid token.
        const tryLogin = async () => {  //async placement matters. would not work in top level useEffect func.
            const userData = await AsyncStorage.getItem('userData'); //get key 'userData' from auth actions.
            if (!userData) { //if userData does not exist/falseish...
                props.navigation.navigate('Auth'); //send user to auth screen.
                return; //return and do not continue.
            }
            const transformedData = JSON.parse(userData);
            const { token, userId, expiryDate } = transformedData; //extract and destructure userData from auth actions.
            const expirationDate = new Date(expiryDate); //convert date string back to actual date format.
            if (expirationDate <= new Date() || !token || !userId) { //checks if token is still valid, ie if expirationDate is smaller than current timestamp then it is in the past.
                props.navigation.navigate('Auth');
                return; 
            }

            const expirationTime = expirationDate.getTime() - new Date().getTime(); //for auto logout.

            props.navigation.navigate('Shop') //if get to this point user and token are valid so navigate to shop.
            dispatch(authActions.authenticate(userId, token, expirationTime)); //and auto login. and forwards these variables to authenticate.
        };
        tryLogin();
    }, [dispatch]); //wouldnt the userData from storage qualify? 

    return (
        <View style={styles.screen}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default StartupScreen;


//screen to show while app is booting up and determining if user logged in already. might not even see it when app starts.