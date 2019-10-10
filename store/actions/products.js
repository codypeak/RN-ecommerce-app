import Product from '../../models/product';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => { //get request 
    return async (dispatch, getState) => { 
        const userId = getState().auth.userId;
        try {
            const response = await fetch('https://rn-ecommerce-app-d521a.firebaseio.com/products.json');

            if (!response.ok) {  //ok is a field available on response object. returns true if response is a 200.
                throw new Error('Something went wrong!');
            }
            const resData = await response.json();
            const loadedProducts = [];

            for (const key in resData) { //map product object data to product array.
                loadedProducts.push(new Product(
                    key, //this is the object name/id/key getting in response from firestore.
                    resData[key].ownerId,
                    resData[key].title,
                    resData[key].imageUrl,
                    resData[key].description,
                    resData[key].price,
                ));
            }
            dispatch({ 
                type: SET_PRODUCTS, 
                products: loadedProducts,
                userProducts: loadedProducts.filter(prod => prod.ownerId === userId) //filter thru loadedProducts to match ownerId and userId. keep these prod b/c they are from currently logged in user. 
            })
        } catch (err) {
            //we really dont need try catch in this example but irl you might want to send to analytics server, etc.
            throw err;
        }
    };
};

export const deleteProduct = productId => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://rn-ecommerce-app-d521a.firebaseio.com/products/${productId}.json?auth=${token}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        dispatch({ type: DELETE_PRODUCT, pid: productId });
    };
};

export const createProduct = (title,  description, imageUrl, price) => {
    return async (dispatch, getState) => { 
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(`https://rn-ecommerce-app-d521a.firebaseio.com/products.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                price,
                ownerId: userId //getState gets userId from redux store.
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
                price,
                ownerId: userId
            }
        }); 
    }
};

export const updateProduct = (id, title, description, imageUrl) => {
    return async (dispatch, getState) => { //getState give access to current redux store.
        const token = getState().auth.token; //auth slice of state in app and token is property on it. 
        const response = await fetch(`https://rn-ecommerce-app-d521a.firebaseio.com/products/${id}.json?auth=${token}`, { //append with token
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
