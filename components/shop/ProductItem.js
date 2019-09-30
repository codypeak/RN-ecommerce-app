import React from 'react';
import { Text, View, StyleSheet, Image, Button, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';

import Colors from '../../constants/Colors';

const ProductItem = props => {
    let TouchableCmp = TouchableOpacity; //buttons still work standalone but TO allows to touch anywhere on card to show detail.
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        touchableCmp = TouchableNativeFeedback; //give ripple effect if on android.
    }

    return (
        <View style={styles.product}>
        <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground> 
            <View>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{uri: props.image}} />
                </View>
                <View style={styles.details}>
                    <Text style={styles.title}>{props.title}</Text>
                    <Text style={styles.price}>${props.price.toFixed(2)}</Text>
                </View>
                <View style={styles.actions}>
                    {props.children}
                </View>
            </View>
        </TouchableCmp> 
        </View>
        </View>
    ) //all these properties forwarded to productoverview.
};

const styles = StyleSheet.create({
    product: {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        height: 300,
        margin: 20,
    },
    touchable: {
        borderRadius: 10,
        overflow: 'hidden'
    },
    imageContainer: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 10, 
        borderTopRightRadius: 10, //image is overlaid on background so not getting the border radius at top so made container
        overflow: 'hidden'  //with overflow hidden so children (image) cant overlap parent. 
    },
    image: {
        width: '100%', //network image so need to set width and height. 
        height: '100%',
    },
    details: {
        alignItems: 'center', //default column so this centers on cross axis. 
        height: '17%',
        padding: 10,
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        marginVertical: 2,
    },
    price: {
        fontFamily: 'open-sans',
        fontSize: 14,
        color: '#888',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', 
        height: '23%',
        paddingHorizontal: 20
    },
});

export default ProductItem;