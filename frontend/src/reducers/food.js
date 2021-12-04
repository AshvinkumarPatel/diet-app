import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../store/api';
import serviceConstants from '../shared/utils/serviceConstants';

const foodSlice = createSlice({
    name: 'food',
    initialState: {
        foodsListByUserId: [],
        foodsList: [],
        loading: false,
        foodCreateStatus: '',
        foodUpdateStatus: '',
        foodDeleteStatus: '',
    },

    reducers: {
        resetCreateFoodStatusData: (foodState, action) => {
            foodState.foodCreateStatus = '';
        },

        resetUpdateFoodStatusData: (foodState, action) => {
            foodState.foodUpdateStatus = '';
        },

        resetDeleteFoodStatusData: (foodState, action) => {
            foodState.foodDeleteStatus = '';
        },

        resetFoodReducer: (foodState, action) => {
            foodState.foodsListByUserId = [];
            foodState.foodsList = [];
            foodState.loading = false;
            foodState.foodCreateStatus = '';
            foodState.foodUpdateStatus = '';
            foodState.foodDeleteStatus = '';
        },

        createFoodRequested: (foodState, action) => {
            foodState.foodCreateStatus = 'PENDING';
            foodState.loading = true;
        },

        createFoodReceived: (foodState, action) => {
            foodState.foodsListByUserId = foodState.foodsListByUserId.concat(
                action.payload.food,
            );
            foodState.foodCreateStatus = 'SUCCESS';
            foodState.loading = false;
        },

        createFoodRequestFailed: (foodState, action) => {
            foodState.foodCreateStatus = action.payload.data.message;
            foodState.loading = false;
        },

        createFoodForUserRequested: (foodState, action) => {
            foodState.foodCreateStatus = 'PENDING';
            foodState.loading = true;
        },

        createFoodForUserReceived: (foodState, action) => {
            foodState.foodsList = foodState.foodsList.concat(
                action.payload.food,
            );
            foodState.foodCreateStatus = 'SUCCESS';
            foodState.loading = false;
        },

        createFoodForUserRequestFailed: (foodState, action) => {
            foodState.foodCreateStatus = action.payload.data.message;
            foodState.loading = false;
        },

        foodsListByUserIdRequested: (foodState, action) => {
            foodState.loading = true;
            foodState.foodsListByUserId = [];
        },

        foodsListByUserIdReceived: (foodState, action) => {
            foodState.foodsListByUserId = action.payload;
            foodState.loading = false;
        },

        foodsListByUserIdRequestFailed: (foodState, action) => {
            foodState.loading = false;
        },

        updateFoodsDataForUser: (foodState, action) => {
            foodState.loading = true;
            foodState.foodUpdateStatus = 'PENDING';
        },

        updateFoodsDataReceived: (foodState, action) => {
            const { id, productName, calorie, isCheatFood, timeConsumed } =
                action.payload;
            foodState.foodsList = foodState.foodsList.map((item) => {
                if (item.id === id) {
                    item = {
                        ...item,
                        productName,
                        calorie,
                        isCheatFood,
                        timeConsumed,
                    };
                }
                return item;
            });
            foodState.loading = false;
            foodState.foodUpdateStatus = 'SUCCESS';
        },

        updateFoodsDataRequestFailed: (foodState, action) => {
            foodState.loading = false;
            foodState.foodUpdateStatus = action.payload.data.message;
        },

        deleteFoodsDataForUser: (foodState, action) => {
            foodState.loading = true;
            foodState.foodDeleteStatus = 'PENDING';
        },

        deleteFoodsDataReceived: (foodState, action) => {
            foodState.foodsList = foodState.foodsList.filter((item) => {
                return action.payload.deleteFoodIds.indexOf(item.id) === -1;
            });
            foodState.loading = false;
            foodState.foodDeleteStatus = 'SUCCESS';
        },

        deleteFoodsDataRequestFailed: (foodState, action) => {
            foodState.loading = false;
            foodState.foodDeleteStatus = action.payload.data.message;
        },

        foodsListRequested: (foodState, action) => {
            foodState.loading = true;
            foodState.foodsList = [];
        },

        foodsListReceived: (foodState, action) => {
            foodState.foodsList = action.payload;
            foodState.loading = false;
        },

        foodsListRequestFailed: (foodState, action) => {
            foodState.loading = false;
        },
    },
});

export default foodSlice.reducer;

const {
    createFoodRequested,
    createFoodReceived,
    createFoodRequestFailed,
    foodsListRequested,
    foodsListReceived,
    foodsListRequestFailed,
    resetCreateFoodStatusData,
    resetFoodReducer,
    foodsListByUserIdRequested,
    foodsListByUserIdReceived,
    foodsListByUserIdRequestFailed,
    createFoodForUserRequested,
    createFoodForUserReceived,
    createFoodForUserRequestFailed,
    updateFoodsDataForUser,
    updateFoodsDataReceived,
    updateFoodsDataRequestFailed,
    resetUpdateFoodStatusData,
    deleteFoodsDataForUser,
    deleteFoodsDataReceived,
    deleteFoodsDataRequestFailed,
    resetDeleteFoodStatusData,
} = foodSlice.actions;

const {
    createFood,
    getFoodsListByUserId,
    getAllFoodsList,
    updateFood,
    deleteFood,
} = serviceConstants;

export const createFoodItem = (data) => (dispatch) => {
    return dispatch(
        apiCallBegan({
            url: `${createFood.url}${createFood.endpoint}`,
            method: createFood.method,
            data,
            onStart: createFoodRequested.type,
            onSuccess: createFoodReceived.type,
            onError: createFoodRequestFailed.type,
        }),
    );
};

export const createFoodItemForUser = (data) => (dispatch) => {
    return dispatch(
        apiCallBegan({
            url: `${createFood.url}${createFood.endpoint}`,
            method: createFood.method,
            data,
            onStart: createFoodForUserRequested.type,
            onSuccess: createFoodForUserReceived.type,
            onError: createFoodForUserRequestFailed.type,
        }),
    );
};

export const updateFoodItemForUser = (data, id) => (dispatch) => {
    return dispatch(
        apiCallBegan({
            url: `${updateFood.url}${updateFood.endpoint}/${id}`,
            method: updateFood.method,
            data,
            onStart: updateFoodsDataForUser.type,
            onSuccess: updateFoodsDataReceived.type,
            onError: updateFoodsDataRequestFailed.type,
        }),
    );
};

export const deleteFoodItems = (data) => (dispatch) => {
    return dispatch(
        apiCallBegan({
            url: `${deleteFood.url}${deleteFood.endpoint}`,
            method: deleteFood.method,
            data,
            onStart: deleteFoodsDataForUser.type,
            onSuccess: deleteFoodsDataReceived.type,
            onError: deleteFoodsDataRequestFailed.type,
        }),
    );
};

export const getFoodsListByUser = (id) => (dispatch) => {
    return dispatch(
        apiCallBegan({
            url: `${getFoodsListByUserId.url}${getFoodsListByUserId.endpoint}/${id}`,
            method: getFoodsListByUserId.method,
            onStart: foodsListByUserIdRequested.type,
            onSuccess: foodsListByUserIdReceived.type,
            onError: foodsListByUserIdRequestFailed.type,
        }),
    );
};

export const getFoodsList = () => (dispatch) => {
    return dispatch(
        apiCallBegan({
            url: `${getAllFoodsList.url}${getAllFoodsList.endpoint}`,
            method: getAllFoodsList.method,
            onStart: foodsListRequested.type,
            onSuccess: foodsListReceived.type,
            onError: foodsListRequestFailed.type,
        }),
    );
};

export const resetCreateFoodStatus = () => (dispatch) => {
    return dispatch(resetCreateFoodStatusData());
};

export const resetUpdateFoodStatus = () => (dispatch) => {
    return dispatch(resetUpdateFoodStatusData());
};

export const resetDeleteFoodStatus = () => (dispatch) => {
    return dispatch(resetDeleteFoodStatusData());
};

export const resetFoodData = () => (dispatch) => {
    return dispatch(resetFoodReducer());
};
