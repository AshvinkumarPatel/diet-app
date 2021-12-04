import { combineReducers } from 'redux';
import user from './user';
import food from './food';
const store = {
    user,
    food,
};

export default combineReducers(store);
