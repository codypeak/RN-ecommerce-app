import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavigationActions }  from 'react-navigation';

import ShopNavigator from './ShopNavigator';

const NavigationContainer = props => {
    const navRef = useRef(); //establishes connection to access to navigation properties in ShopNavigator.
    const isAuth = useSelector(state => !!state.auth.token); //double bang forces true/false. if no token false. if token exists true. 

    useEffect(() => {//to listen to changes in isAuth.
        if (!isAuth) { //if isAuth is not true
            navRef.current.dispatch(
                NavigationActions.navigate({ routeName: 'Auth' })
            );
        }   
    }, [isAuth]);

    return <ShopNavigator ref={navRef} />;
};

export default NavigationContainer;

//wrapping ShopNavigator in this so upon auto logout we go back to auth screen.
//and then in app comp wrap NavigationContainer (instead of ShopNavigator) with Provider.
//so now this container has access to redux store in order to navigate after auto logout.

//is this convoluted? couldnt you upon token expiry call logout func