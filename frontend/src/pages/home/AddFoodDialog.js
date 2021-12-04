import React, { useState, useCallback, useReducer, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Alert,
    TextField,
    Box,
    Grid,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';

import { createFoodItem, resetCreateFoodStatus } from '../../reducers/food';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label='close'
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

function addFoodReducer(state, action) {
    switch (action.type) {
        case 'productName':
            return {
                ...state,
                productName: action.data,
                productNameError: false,
            };
        case 'timeConsumed':
            return {
                ...state,
                timeConsumed: action.data,
                timeConsumedError: false,
            };
        case 'calorie':
            return {
                ...state,
                calorie: action.data,
                calorieError: false,
            };
        case 'isCheatFood':
            return {
                ...state,
                isCheatFood: action.data,
            };
        case 'productNameError':
            return {
                ...state,
                productNameError: true,
            };
        case 'timeConsumedError':
            return {
                ...state,
                timeConsumedError: true,
            };
        case 'calorieError':
            return {
                ...state,
                calorieError: true,
            };
        default:
            return state;
    }
}

const initialState = {
    productName: '',
    productNameError: false,
    calorie: '',
    calorieError: false,
    timeConsumed: new Date(),
    timeConsumedError: false,
    isCheatFood: false,
};

export default function AddFoodDialog({ handleClose }) {
    const [state, dispatch] = useReducer(addFoodReducer, initialState);
    const [errorMessage, setErrorMessage] = useState('');
    const { user, food } = useSelector((state) => state);
    const storeDispatch = useDispatch();
    useEffect(() => {
        if (food?.foodCreateStatus) {
            if (
                !(
                    food.foodCreateStatus === 'PENDING' ||
                    food.foodCreateStatus === 'SUCCESS'
                )
            ) {
                setErrorMessage(food.foodCreateStatus);
            } else if (food.foodCreateStatus === 'SUCCESS') {
                storeDispatch(resetCreateFoodStatus());
                handleClose();
            }
        }
    }, [food?.foodCreateStatus, handleClose, storeDispatch]);
    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            setErrorMessage('');
            const { productName, calorie, timeConsumed, isCheatFood } = state;
            if (productName.trim() && calorie && timeConsumed) {
                storeDispatch(
                    createFoodItem({
                        productName: productName.trim(),
                        calorie: parseInt(calorie, 10),
                        timeConsumed,
                        isCheatFood,
                        creator: user?.userDetails?.id,
                    }),
                );
            } else {
                if (!productName) {
                    dispatch({
                        type: 'productNameError',
                    });
                }
                if (calorie === '') {
                    dispatch({
                        type: 'calorieError',
                    });
                }
                if (!timeConsumed) {
                    dispatch({
                        type: 'timeConsumedError',
                    });
                }
            }
        },
        [state, storeDispatch, user?.userDetails?.id],
    );

    const handleOnChange = useCallback(
        (e) => {
            dispatch({
                type: e.target.name,
                data: e.target.value,
            });
            setErrorMessage('');
        },
        [dispatch],
    );
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby='customized-dialog-title'
            open={true}>
            <BootstrapDialogTitle
                id='customized-dialog-title'
                onClose={handleClose}>
                Add Food Entry
            </BootstrapDialogTitle>
            <DialogContent dividers>
                <Box component='form' noValidate onSubmit={handleSubmit}>
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        id='productName'
                        label='Product Name'
                        name='productName'
                        autoComplete='productName'
                        autoFocus
                        onChange={handleOnChange}
                        error={state.productNameError}
                        helperText={
                            state.productNameError
                                ? 'Please enter valid product name'
                                : ''
                        }
                    />
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        type='number'
                        id='calorie'
                        label='Calorie'
                        name='calorie'
                        autoComplete='calorie'
                        onChange={handleOnChange}
                        error={state.calorieError}
                        helperText={
                            state.calorieError
                                ? 'Please enter valid calorie'
                                : ''
                        }
                    />
                    <Box sx={{ flexGrow: 1, mb: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={7}>
                                <LocalizationProvider
                                    dateAdapter={AdapterDateFns}>
                                    <DateTimePicker
                                        renderInput={(props) => (
                                            <TextField {...props} />
                                        )}
                                        label='Time Consumed'
                                        name='timeConsumed'
                                        value={state.timeConsumed}
                                        onChange={(newValue) => {
                                            handleOnChange({
                                                target: {
                                                    value: newValue,
                                                    name: 'timeConsumed',
                                                },
                                            });
                                        }}
                                        maxDateTime={new Date()}
                                        error={state.timeConsumedError}
                                        helperText={
                                            state.timeConsumedError
                                                ? 'Please enter valid date and time'
                                                : ''
                                        }
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={5}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        label='Is Cheat Food?'
                                        onClick={(e) => {
                                            handleOnChange({
                                                target: {
                                                    value: e.target.checked,
                                                    name: 'isCheatFood',
                                                },
                                            });
                                        }}
                                    />
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </Box>
                    {errorMessage && (
                        <Alert severity='error'>{errorMessage}</Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleSubmit}>
                    Save
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}
