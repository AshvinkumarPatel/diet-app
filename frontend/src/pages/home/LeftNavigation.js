import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
    Dashboard as DashboardIcon,
    ShoppingCart as ShoppingCartIcon,
    People as PeopleIcon,
} from '@mui/icons-material';

import AddFoodDialog from './AddFoodDialog';
import UpdateDailyThreshold from './UpdateDailyThreshold';
import { resetCreateFoodStatus } from '../../reducers/food';

const LeftNavigation = () => {
    const [addFoodDialog, showAddFoodDialog] = useState(false);
    const dispatch = useDispatch();
    const [updateDailyThresholdDialog, showUpdateDailyThresholdDialog] =
        useState(false);
    return (
        <div>
            {addFoodDialog && (
                <AddFoodDialog handleClose={() => showAddFoodDialog(false)} />
            )}
            {updateDailyThresholdDialog && (
                <UpdateDailyThreshold
                    handleClose={() => showUpdateDailyThresholdDialog(false)}
                />
            )}
            <ListItem button>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary='Dashboard' />
            </ListItem>
            <ListItem
                button
                onClick={() => {
                    showAddFoodDialog(true);
                    dispatch(resetCreateFoodStatus());
                }}>
                <ListItemIcon>
                    <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary='Add Food' />
            </ListItem>
            <ListItem
                button
                onClick={() => {
                    showUpdateDailyThresholdDialog(true);
                }}>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary='Change Daily Limit' />
            </ListItem>
        </div>
    );
};

export default LeftNavigation;
