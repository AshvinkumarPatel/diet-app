import React from 'react';
import { useDispatch } from 'react-redux';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
    Dashboard as DashboardIcon,
    ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';

import AddEditFoodDialog from './AddEditFoodDialog';
import {
    resetCreateFoodStatus,
    resetUpdateFoodStatus,
} from '../../reducers/food';

const LeftNavigation = ({
    addEditFoodDialog,
    showAddEditFoodDialog,
    whichOperation,
    foodDetails,
}) => {
    const dispatch = useDispatch();
    return (
        <div>
            {addEditFoodDialog && (
                <AddEditFoodDialog
                    handleClose={() => showAddEditFoodDialog(false)}
                    whichOperation={whichOperation}
                    foodDetails={foodDetails}
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
                    showAddEditFoodDialog(true);
                    dispatch(resetCreateFoodStatus());
                    dispatch(resetUpdateFoodStatus());
                }}>
                <ListItemIcon>
                    <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary='Add Food for User' />
            </ListItem>
        </div>
    );
};

export default LeftNavigation;
