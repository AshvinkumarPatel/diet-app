import React, { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Menu as MenuIcon } from '@mui/icons-material';
import {
    CssBaseline,
    Toolbar,
    Typography,
    IconButton,
    Alert,
} from '@mui/material';

import { AppBar } from './muiComponents';
import Logout from './logout';

const HeaderNavigation = () => {
    const [open, setOpen] = useState(true);
    const { user, food } = useSelector((state) => state);

    const toggleDrawer = useCallback(() => {
        setOpen(!open);
    }, [setOpen, open]);
    const isAdmin = user?.userDetails?.isAdmin;

    const foodCaloriesConsumed = useMemo(() => {
        let caloriesConsumed = 0;
        if (isAdmin) {
            return caloriesConsumed;
        }
        food.foodsListByUserId.forEach((item) => {
            if (
                !item.isCheatFood &&
                moment(item.timeConsumed).isSame(moment(), 'day')
            ) {
                caloriesConsumed += item.calorie;
            }
        });
        return caloriesConsumed;
    }, [food.foodsListByUserId, isAdmin]);

    return (
        <>
            <CssBaseline />
            <AppBar position='absolute' open={open}>
                <Toolbar
                    sx={{
                        pr: '24px', // keep right padding when drawer closed
                    }}>
                    <IconButton
                        edge='start'
                        color='inherit'
                        aria-label='open drawer'
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: '36px',
                            ...(open && { display: 'none' }),
                        }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        component='h1'
                        variant='h6'
                        color='inherit'
                        noWrap
                        sx={{ flexGrow: 1 }}>
                        {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                    </Typography>
                    {!isAdmin && (
                        <>
                            <Typography
                                component='h1'
                                variant='h6'
                                color='inherit'
                                noWrap
                                sx={{ flexGrow: 1 }}>
                                Daily Threshold Limit:{' '}
                                {user?.userDetails?.dailyThreshold}
                            </Typography>
                            {foodCaloriesConsumed >
                                user?.userDetails?.dailyThreshold && (
                                <Typography
                                    component='h1'
                                    variant='h6'
                                    color='inherit'
                                    noWrap
                                    sx={{ flexGrow: 1 }}>
                                    <Alert severity='error'>
                                        Today's intake is more than daily
                                        threshold.
                                    </Alert>
                                </Typography>
                            )}
                        </>
                    )}
                    <Typography
                        component='h1'
                        variant='h6'
                        color='white'
                        noWrap
                        sx={{ flexGrow: 1 }}>
                        <Logout />
                    </Typography>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default HeaderNavigation;
