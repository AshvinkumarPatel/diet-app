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
    InputLabel,
    MenuItem,
    Select,
    FormControl,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';

import {
    createFoodItemForUser,
    updateFoodItemForUser,
    resetCreateFoodStatus,
} from '../../reducers/food';

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
        case 'creator':
            return {
                ...state,
                creator: action.data,
                creatorError: false,
            };
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
        case 'creatorError':
            return {
                ...state,
                creatorError: true,
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
    creator: '',
    creatorError: false,
    productName: '',
    productNameError: false,
    calorie: '',
    calorieError: false,
    timeConsumed: new Date(),
    timeConsumedError: false,
    isCheatFood: false,
};

export default function AddEditFoodDialog({
    handleClose,
    whichOperation,
    foodDetails,
}) {
    const [state, dispatch] = useReducer(addFoodReducer, initialState);
    const [errorMessage, setErrorMessage] = useState('');
    const { user, food } = useSelector((state) => state);
    const storeDispatch = useDispatch();
    useEffect(() => {
        if (whichOperation === 'edit' && foodDetails) {
            dispatch({
                type: 'creator',
                data: foodDetails?.creator?.id,
            });
            dispatch({
                type: 'productName',
                data: foodDetails?.productName,
            });
            dispatch({
                type: 'isCheatFood',
                data: foodDetails?.isCheatFood,
            });
            dispatch({
                type: 'calorie',
                data: foodDetails?.calorie,
            });
            dispatch({
                type: 'timeConsumed',
                data: foodDetails?.timeConsumed,
            });
        }
    }, [foodDetails, whichOperation]);
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
        if (food?.foodUpdateStatus) {
            if (
                !(
                    food.foodUpdateStatus === 'PENDING' ||
                    food.foodUpdateStatus === 'SUCCESS'
                )
            ) {
                setErrorMessage(food.foodUpdateStatus);
            } else if (food.foodUpdateStatus === 'SUCCESS') {
                handleClose();
            }
        }
    }, [
        food?.foodCreateStatus,
        food?.foodUpdateStatus,
        handleClose,
        storeDispatch,
    ]);
    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            setErrorMessage('');
            const { productName, calorie, timeConsumed, isCheatFood, creator } =
                state;
            if (productName.trim() && calorie && timeConsumed && creator) {
                if (whichOperation === 'create') {
                    storeDispatch(
                        createFoodItemForUser({
                            productName: productName.trim(),
                            calorie: parseInt(calorie, 10),
                            timeConsumed,
                            isCheatFood,
                            creator,
                        }),
                    );
                } else if (whichOperation === 'edit') {
                    storeDispatch(
                        updateFoodItemForUser(
                            {
                                productName: productName.trim(),
                                calorie: parseInt(calorie, 10),
                                timeConsumed,
                                isCheatFood,
                            },
                            foodDetails?.id,
                        ),
                    );
                }
            } else {
                if (!creator) {
                    dispatch({
                        type: 'creatorError',
                    });
                }
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
        [state, storeDispatch, whichOperation, foodDetails?.id],
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
                {whichOperation === 'create' ? 'Add' : 'Edit'} Food Entry for
                User
            </BootstrapDialogTitle>
            <DialogContent dividers>
                <Box component='form' noValidate onSubmit={handleSubmit}>
                    <FormControl fullWidth>
                        <InputLabel id='creator-label'>User</InputLabel>
                        <Select
                            labelId='creator-label'
                            id='creator'
                            value={state.creator}
                            label='creator'
                            disabled={whichOperation === 'edit'}
                            onChange={(event) => {
                                handleOnChange({
                                    target: {
                                        value: event.target.value,
                                        name: 'creator',
                                    },
                                });
                            }}
                            required
                            error={state.creatorError}>
                            {user?.usersList?.map((item) => {
                                return (
                                    <MenuItem
                                        key={item.id}
                                        value={
                                            item.id
                                        }>{`${item.firstName} ${item.lastName}`}</MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
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
                        value={state?.productName}
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
                        value={state?.calorie}
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
                                        checked={state?.isCheatFood}
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
                    {whichOperation === 'create' ? 'Create' : 'Update'}
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}
