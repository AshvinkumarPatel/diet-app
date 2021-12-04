import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { updateDailyThresholdLimit } from '../../reducers/user';

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

export default function UpdateDailyThresholdDialog({ handleClose }) {
    const user = useSelector((state) => state.user);
    const [dailyThreshold, setDailyThreshold] = useState(
        user?.userDetails?.dailyThreshold,
    );
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const handleSubmit = useCallback(() => {
        if (dailyThreshold >= 0) {
            dispatch(
                updateDailyThresholdLimit({
                    userId: user?.userDetails?.id,
                    dailyThreshold: parseInt(dailyThreshold, 10),
                }),
            ).then(() => {
                handleClose();
            });
        } else {
            setErrorMessage('Please enter valid threshold');
        }
    }, [dispatch, dailyThreshold, user?.userDetails?.id, handleClose]);
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby='customized-dialog-title'
            open={true}>
            <BootstrapDialogTitle
                id='customized-dialog-title'
                onClose={handleClose}>
                Update Daily Threshold
            </BootstrapDialogTitle>
            <DialogContent dividers>
                <Box
                    component='form'
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 1, ml: 1, mr: 1 }}>
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        type='number'
                        id='dailyThreshold'
                        label='Daily Threshold'
                        name='dailyThreshold'
                        autoComplete='dailyThreshold'
                        autoFocus
                        value={dailyThreshold}
                        onChange={(e) => {
                            setDailyThreshold(e.target.value);
                            setErrorMessage('');
                        }}
                        error={!dailyThreshold}
                        helperText={
                            !dailyThreshold
                                ? 'Please enter valid daily threshold'
                                : ''
                        }
                    />
                    {errorMessage && (
                        <Alert severity='error'>{errorMessage}</Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleSubmit}>
                    Update
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}
