import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../store/api';
import serviceConstants from '../shared/utils/serviceConstants';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userDetails: null,
        usersList: [],
        loading: false,
        userCreateStatus: '',
        unAuthorizedUser: false,
    },

    reducers: {
        loginRequested: (userState, action) => {
            userState.loading = true;
            userState.userDetails = null;
        },

        loginReceived: (userState, action) => {
            userState.userDetails = action.payload;
            userState.unAuthorizedUser = false;
            userState.loading = false;
        },

        loginRequestFailed: (userState, action) => {
            userState.userDetails = action.payload;
            userState.loading = false;
        },

        resetCreateUserStatusData: (userState, action) => {
            userState.userCreateStatus = '';
        },

        signUpRequested: (userState, action) => {
            userState.loading = true;
            userState.userCreateStatus = '';
        },

        signUpReceived: (userState, action) => {
            userState.loading = false;
            userState.unAuthorizedUser = false;
            userState.userCreateStatus = 'SUCCESS';
        },

        signUpRequestFailed: (userState, action) => {
            userState.loading = false;
            userState.userCreateStatus = action.payload.data.message;
        },

        userListRequested: (userState, action) => {
            userState.loading = true;
            userState.usersList = [];
        },

        userListReceived: (userState, action) => {
            userState.usersList = action.payload;
            userState.loading = false;
        },

        userListRequestFailed: (userState, action) => {
            userState.loading = false;
        },

        updateDailyThresholdRequested: (userState, action) => {
            userState.loading = true;
        },

        updateDailyThresholdReceived: (userState, action) => {
            userState.userDetails = {
                ...userState.userDetails,
                dailyThreshold: action.payload.user.dailyThreshold,
            };
            userState.loading = false;
        },

        updateDailyThresholdRequestFailed: (userState, action) => {
            userState.loading = false;
        },

        resetUserReducer: (userState, action) => {
            userState.userDetails = null;
            userState.usersList = [];
        },

        unAuthorizedUser: (userState, action) => {
            userState.userDetails = null;
            userState.unAuthorizedUser = true;
            userState.loading = false;
        },
    },
});

export default userSlice.reducer;

const {
    loginRequested,
    loginReceived,
    loginRequestFailed,
    signUpRequested,
    signUpReceived,
    signUpRequestFailed,
    userListRequested,
    userListReceived,
    userListRequestFailed,
    updateDailyThresholdRequested,
    updateDailyThresholdReceived,
    updateDailyThresholdRequestFailed,
    resetUserReducer,
    resetCreateUserStatusData,
    unAuthorizedUser,
} = userSlice.actions;

const { login, signUp, getUsers, updateDailyThreshold, getUserDetails } =
    serviceConstants;

export const loginValidate = (data) => (dispatch) => {
    return dispatch(
        apiCallBegan({
            url: `${login.url}${login.endpoint}`,
            method: login.method,
            data,
            onStart: loginRequested.type,
            onSuccess: loginReceived.type,
            onError: loginRequestFailed.type,
        }),
    );
};

export const signUpUser = (data) => (dispatch) => {
    return dispatch(
        apiCallBegan({
            url: `${signUp.url}${signUp.endpoint}`,
            method: signUp.method,
            data,
            onStart: signUpRequested.type,
            onSuccess: signUpReceived.type,
            onError: signUpRequestFailed.type,
        }),
    );
};

export const getUsersList = () => (dispatch) => {
    return dispatch(
        apiCallBegan({
            url: `${getUsers.url}${getUsers.endpoint}`,
            method: getUsers.method,
            onStart: userListRequested.type,
            onSuccess: userListReceived.type,
            onError: userListRequestFailed.type,
        }),
    );
};

export const getUserDetailsByToken = () => (dispatch) => {
    return dispatch(
        apiCallBegan({
            url: `${getUserDetails.url}${getUserDetails.endpoint}`,
            method: getUserDetails.method,
            data: null,
            onStart: loginRequested.type,
            onSuccess: loginReceived.type,
            onError: loginRequestFailed.type,
        }),
    );
};

export const updateDailyThresholdLimit = (data) => (dispatch) => {
    return dispatch(
        apiCallBegan({
            url: `${updateDailyThreshold.url}${updateDailyThreshold.endpoint}`,
            method: updateDailyThreshold.method,
            data,
            onStart: updateDailyThresholdRequested.type,
            onSuccess: updateDailyThresholdReceived.type,
            onError: updateDailyThresholdRequestFailed.type,
        }),
    );
};

export const resetUserData = () => (dispatch) => {
    return dispatch(resetUserReducer());
};

export const resetUserCreateStatus = () => (dispatch) => {
    return dispatch(resetCreateUserStatusData());
};

export const unAuthorizedUserAccess = () => (dispatch) => {
    return dispatch(unAuthorizedUser());
};
