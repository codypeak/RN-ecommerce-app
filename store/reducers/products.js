import PRODUCTS from '../../data/dummy-data';
import { DELETE_PRODUCT, CREATE_PRODUCT, UPDATE_PRODUCT } from '../actions/products';
import Product from '../../models/product';

const initialState = {
    availableProducts: PRODUCTS,
    userProducts: PRODUCTS.filter(prod => prod.ownerId === 'u1'),
};

export default (state = initialState, action) => {
    switch (action.type) {
        case CREATE_PRODUCT:
            const newProduct = new Product(
                new Date().toString(),
                'u1',
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                action.productData.price,
            );
            return {
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct)
            };
        case UPDATE_PRODUCT:
            const productIndex = state.userProducts.findIndex(prod => prod.id === action.pid);
            const updatedProduct = new Product(
                action.pid,
                state.userProducts[productIndex].ownerId,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                action.userProducts[productIndex].price, //price can not be edited. 
            );
            const updatedUserProducts = [...state.userProducts];
            updatedUserProducts[productIndex] = updatedProduct; //set product being edited at specific index to the new update product, replacing it.
            const availableProductIndex = state.availableProducts.findIndex(prod => prod.id === action.pid);
            const updatedAvailableProducts = [...state.availableProducts];
            updatedAvailableProducts[availableProductIndex] = updatedProduct;
            return {
                ...state,
                availableProducts: updatedAvailableProducts,
                userProducts: updatedUserProducts
            }
        case DELETE_PRODUCT: 
            return {
                ...state,
                userProducts: state.userProducts.filter( //filter if return true keep item in new array and false removes item.
                    product => product.id !== action.pid  //keeps all products where id's don't match. if do match we want to delete.
                ), 
                availableProducts: state.availableProducts.filter(
                    product => product.id !== action.pid
                )
            };
    }
    return state;
};