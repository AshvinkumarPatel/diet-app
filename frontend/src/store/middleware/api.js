import axios from 'axios';
import * as actions from '../api';

import { unAuthorizedUserAccess } from '../../reducers/user';

const { REACT_APP_API_URL } = process.env;

const api =
    ({ dispatch }) =>
    (next) =>
    async (action) => {
        if (action.type !== actions.apiCallBegan.type) return next(action);

        const { url, method, data, onStart, onSuccess, onError } =
            action.payload;

        if (onStart) dispatch({ type: onStart });

        next(action);

        try {
            const response = await axios.request({
                baseURL: REACT_APP_API_URL,
                url,
                method,
                data,
            });
            // General
            dispatch(actions.apiCallSucess(response.data));
            // Specific
            if (onSuccess)
                dispatch({ type: onSuccess, payload: response.data });
        } catch (error) {
            if (
                error?.response?.status === 401 ||
                error?.response?.status === 403
            ) {
                dispatch(unAuthorizedUserAccess());
            } else {
                // General
                dispatch(actions.apiCallFailed(error.response));
                // Specific
                if (onError)
                    dispatch({ type: onError, payload: error.response });
            }
        }
    };

export default api;
