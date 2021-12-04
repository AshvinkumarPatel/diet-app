import React, { useReducer, useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';

import Copyright from '../../shared/component/copyright';
import { ValidateEmail } from '../../shared/utils/validator';
import { loginValidate } from '../../reducers/user';

const theme = createTheme();

function signInReducer(state, action) {
    switch (action.type) {
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
    email: '',
    emailError: false,
    password: '',
    passwordError: false,
};

const SignInSide = ({ userDetails }) => {
    const [state, dispatch] = useReducer(signInReducer, initialState);
    const [errorMessage, setErrorMessage] = useState('');

    const storeDispatch = useDispatch();
    useEffect(() => {
        if (userDetails && !userDetails.id && userDetails?.data?.message) {
            setErrorMessage(userDetails?.data?.message);
        }
    }, [userDetails]);

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            setErrorMessage('');
            const { email, password } = state;
            if (email && password && ValidateEmail(email)) {
                storeDispatch(loginValidate({ email, password }));
            } else {
                if (!email.trim() || !ValidateEmail(email)) {
                    dispatch({
                        type: 'emailError',
                    });
                }
                if (!password) {
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

    return (
        <ThemeProvider theme={theme}>
            <Grid container component='main' sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(/login.jpg)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light'
                                ? t.palette.grey[50]
                                : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    component={Paper}
                    elevation={6}
                    square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component='h1' variant='h5'>
                            Sign in
                        </Typography>
                        <Box
                            component='form'
                            noValidate
                            onSubmit={handleSubmit}
                            sx={{ mt: 1 }}>
                            <TextField
                                margin='normal'
                                required
                                fullWidth
                                id='email'
                                label='Email Address'
                                name='email'
                                autoComplete='email'
                                autoFocus
                                onChange={onChangeHandler}
                                error={state.emailError}
                                helperText={
                                    state.emailError
                                        ? 'Please enter valid email address'
                                        : ''
                                }
                            />
                            <TextField
                                margin='normal'
                                required
                                fullWidth
                                name='password'
                                label='Password'
                                type='password'
                                id='password'
                                autoComplete='current-password'
                                onChange={onChangeHandler}
                                error={state.passwordError}
                                helperText={
                                    state.passwordError
                                        ? 'Please enter password'
                                        : ''
                                }
                            />
                            {errorMessage && (
                                <Alert severity='error'>{errorMessage}</Alert>
                            )}
                            <Button
                                type='submit'
                                fullWidth
                                variant='contained'
                                sx={{ mt: 3, mb: 2 }}>
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link to='/signup' variant='body2'>
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Copyright sx={{ mt: 5 }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default SignInSide;
