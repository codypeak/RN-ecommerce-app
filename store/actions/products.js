import Product from '../../models/product';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => { //get request 
    return async dispatch => { 
        try {
            const response = await fetch('https://rn-ecommerce-app-d521a.firebaseio.com/products.json');

            if (!response.ok) {  //ok is a field available on response object. returns true if response is a 200.
                throw new Error('Something went wrong!');
            }
            const resData = await response.json();
            const loadedProduct = [];

            for (const key in resData) { //map product object data to product array.
                loadedProduct.push(new Product(
                    key, //this is the object name/id/key getting in response from firestore.
                    'u1',
                    resData[key].title,
                    resData[key].imageUrl,
                    resData[key].description,
                    resData[key].price,
                ));
            }
            dispatch({ type: SET_PRODUCTS, products: loadedProduct })
        } catch (err) {
            //we really dont need try catch in this example but irl you might want to send to analytics server, etc.
            throw err;
        }
    };
};

export const deleteProduct = productId => {
    return async dispatch => {
        const response = await fetch(`https://rn-ecommerce-app-d521a.firebaseio.com/products/${productId}.json`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        dispatch({ type: DELETE_PRODUCT, pid: productId });
    };
};

export const createProduct = (title,  description, imageUrl, price) => {
    return async dispatch => { 
        const response = await fetch(`https://rn-ecommerce-app-d521a.firebaseio.com/products.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                price
            })
        });

        const resData = await response.json();
        
        dispatch({
            type: CREATE_PRODUCT, 
            productData: {
                id: resData.name,
                title,
                description,
                imageUrl, 
                price
            }
        });
    }
};

export const updateProduct = (id, title, description, imageUrl) => {
    return async dispatch => {
        const response = await fetch(`https://rn-ecommerce-app-d521a.firebaseio.com/products/${id}.json`, {
            method: 'PATCH', //this only updates what you tell it to. PUT would overwrite everything.
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
            })
        });

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        dispatch({ 
            type: UPDATE_PRODUCT, 
            pid: id,
            productData: {
                title,
                description,
                imageUrl, 
            }
        });
    };
};

//adding thunk: action creators can be async, but reducers have to be synchronous so can not have any async code in them.
