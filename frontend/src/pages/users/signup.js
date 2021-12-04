import React, { useReducer, useState, useCallback, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';

import Copyright from '../../shared/component/copyright';
import OverlayModal from '../../shared/component/overlayModal';
import { ValidateEmail } from '../../shared/utils/validator';

import { resetUserCreateStatus, signUpUser } from '../../reducers/user';

const theme = createTheme();

function signUpReducer(state, action) {
    switch (action.type) {
        case 'firstName':
            return {
                ...state,
                firstName: action.data,
                firstNameError: false,
            };
        case 'lastName':
            return {
                ...state,
                lastName: action.data,
                lastNameError: false,
            };
        case 'email':
            return {
                ...state,
                email: action.data,
                emailError: false,
            };
        case 'password':
            return {
                ...state,
                password: action.data,
                passwordError: false,
            };
        case 'firstNameError':
            return {
                ...state,
                firstNameError: true,
            };
        case 'lastNameError':
            return {
                ...state,
                lastNameError: true,
            };
        case 'emailError':
            return {
                ...state,
                emailError: true,
            };
        case 'passwordError':
            return {
                ...state,
                passwordError: true,
            };
        default:
            return state;
    }
}

const initialState = {
    firstName: '',
    firstNameError: false,
    lastName: '',
    lastNameError: false,
    email: '',
    emailError: false,
    password: '',
    passwordError: false,
};

export default function SignUp() {
    const [state, dispatch] = useReducer(signUpReducer, initialState);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const history = useHistory();
    const storeDispatch = useDispatch();
    const user = useSelector((state) => state.user);

    useEffect(() => {
        storeDispatch(resetUserCreateStatus());
    });

    useEffect(() => {
        if (user?.userCreateStatus) {
            if (user.userCreateStatus !== 'SUCCESS') {
                setErrorMessage(user.userCreateStatus);
            } else {
                setShowSuccessDialog(true);
            }
        }
    }, [user?.userCreateStatus, setShowSuccessDialog]);

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            setErrorMessage('');
            const { firstName, lastName, email, password } = state;
            if (
                firstName.trim() &&
                lastName.trim() &&
                email.trim() &&
                password &&
                password.length >= 6 &&
                ValidateEmail(email)
            ) {
                storeDispatch(
                    signUpUser({
                        firstName: firstName.trim(),
                        lastName: lastName.trim(),
                        email: email.trim(),
                        password,
                    }),
                );
            } else {
                if (!firstName) {
                    dispatch({
                        type: 'firstNameError',
                    });
                }
                if (!lastName) {
                    dispatch({
                        type: 'lastNameError',
                    });
                }
                if (!email.trim() || !ValidateEmail(email)) {
                    dispatch({
                        type: 'emailError',
                    });
                }
                if (!password || password.length < 6) {
                    dispatch({
                        type: 'passwordError',
                    });
                }
            }
        },
        [state, dispatch, storeDispatch],
    );

    const onChangeHandler = useCallback(
        (e) => {
            dispatch({
                type: e.target.name,
                data: e.target.value,
            });
            setErrorMessage('');
        },
        [dispatch],
    );

    const onCloseHandler = useCallback(() => {
        setShowSuccessDialog(false);
        history.push('/login');
    }, [history]);

    return (
        <ThemeProvider theme={theme}>
            <Container component='main' maxWidth='xs'>
                <CssBaseline />
                {showSuccessDialog && (
                    <OverlayModal
                        handleClose={onCloseHandler}
                        heading='Success'
                        message='User is successfully created. Please login now.'
                    />
                )}
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component='h1' variant='h5'>
                        Sign up
                    </Typography>
                    <Box
                        component='form'
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete='given-name'
                                    name='firstName'
                                    required
                                    fullWidth
                                    id='firstName'
                                    label='First Name'
                                    autoFocus
                                    onChange={onChangeHandler}
                                    error={state.firstNameError}
                                    helperText={
                                        state.firstNameError
                                            ? 'Please enter first name'
                                            : ''
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id='lastName'
                                    label='Last Name'
                                    name='lastName'
                                    autoComplete='family-name'
                                    onChange={onChangeHandler}
                                    error={state.lastNameError}
                                    helperText={
                                        state.lastNameError
                                            ? 'Please enter last name'
                                            : ''
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id='email'
                                    label='Email Address'
                                    name='email'
                                    autoComplete='email'
                                    onChange={onChangeHandler}
                                    error={state.emailError}
                                    helperText={
                                        state.emailError
                                            ? 'Please enter valid email'
                                            : ''
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name='password'
                                    label='Password'
                                    type='password'
                                    id='password'
                                    autoComplete='new-password'
                                    onChange={onChangeHandler}
                                    error={state.passwordError}
                                    helperText={
                                        state.passwordError
                                            ? 'Please enter minimum 6 character password'
                                            : ''
                                    }
                                />
                            </Grid>
                        </Grid>
                        {errorMessage && (
                            <Alert sx={{ mt: 1 }} severity='error'>
                                {errorMessage}
                            </Alert>
                        )}
                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            sx={{ mt: 3, mb: 2 }}>
                            Sign Up
                        </Button>
                        <Grid container justifyContent='flex-end'>
                            <Grid item>
                                <Link to='/login' variant='body2'>
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}
