import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Loader from './shared/component/loader';
import OverlayModal from './shared/component/overlayModal';
import Login from './pages/users/login';
import SignUp from './pages/users/signup';
import Dashboard from './pages/dashboard';
import Home from './pages/home';

import { getUsersList, getUserDetailsByToken } from './reducers/user';
import {
    getFoodsListByUser,
    resetFoodData,
    getFoodsList,
} from './reducers/food';

function App() {
    const { user, food } = useSelector((state) => state);
    const [showUnAuthorizedDialog, setShowUnAuthorizedDialog] = useState(false);
    const dispatch = useDispatch();
    const { userDetails } = user;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // get user details
            dispatch(getUserDetailsByToken());
        }
    }, [dispatch]);

    // Detect user details and make next calls to get users list for admin and foods list for normal users
    useEffect(() => {
        if (userDetails && userDetails.id) {
            const token = userDetails.token;
            if (token) {
                // set token to local storage so it will get used for all other request through axios interceptor
                localStorage.setItem('token', token);
            }
            if (userDetails.isAdmin) {
                dispatch(getUsersList());
                dispatch(getFoodsList());
            } else {
                dispatch(getFoodsListByUser(userDetails.id));
            }
        }
    }, [userDetails, dispatch]);

    // On detection of unauthorized user it will show pop up and immediately user will be redirect to login page
    useEffect(() => {
        if (user?.unAuthorizedUser) {
            setShowUnAuthorizedDialog(true);
            dispatch(resetFoodData());
        }
    }, [user?.unAuthorizedUser, dispatch]);

    let routes;

    if (user?.userDetails?.id) {
        if (user?.userDetails?.isAdmin) {
            routes = (
                <Switch>
                    <Route path='/home' exact>
                        <Dashboard />
                    </Route>
                    <Redirect to='/home' />
                </Switch>
            );
        } else {
            routes = (
                <Switch>
                    <Route path='/home' exact>
                        <Home />
                    </Route>
                    <Redirect to='/home' />
                </Switch>
            );
        }
    } else {
        routes = (
            <Switch>
                <Route path='/login'>
                    <Login userDetails={userDetails} />
                </Route>
                <Route path='/signup'>
                    <SignUp />
                </Route>
                <Redirect to='/login' />
            </Switch>
        );
    }

    return (
        <Router>
            {showUnAuthorizedDialog && (
                <OverlayModal
                    handleClose={() => {
                        setShowUnAuthorizedDialog(false);
                        localStorage.removeItem('token');
                    }}
                    heading='Unauthorized Access'
                    message='Please validate your credentials again by logging again.'
                />
            )}
            {(user?.loading || food?.loading) && <Loader />}
            <main>{routes}</main>
        </Router>
    );
}

export default App;
