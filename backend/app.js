const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// setup .env usage in app
require('dotenv').config({ path: __dirname + '/.env' });

const port = process.env.PORT || 5000;

const usersRoutes = require('./routes/users-routes');
const foodsRoutes = require('./routes/foods-routes');

const HttpError = require('./models/http-error');
const {
    FOODS_API,
    USERS_API,
    SIGN_UP_ENDPOINT,
    LOGIN_ENDPOINT,
} = require('./utils/constants');

const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.json()); // Used to parse JSON bodies

const excludeAuthenticateTokenAPIs = [
    `${LOGIN_ENDPOINT}`,
    `${SIGN_UP_ENDPOINT}`,
];

const authenticateToken = (req, res, next) => {
    if (excludeAuthenticateTokenAPIs.indexOf(req.url) !== -1) {
        // No need to check auth token for excluded routes
        next();
    } else {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            const error = new HttpError('No token passed.', 401);
            return next(error);
        } else {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {
                    const error = new HttpError('Invalid token passed.', 403);
                    return next(error);
                }
                req.user = user;
                next();
            });
        }
    }
};

app.use(FOODS_API, authenticateToken, foodsRoutes);
app.use(USERS_API, authenticateToken, usersRoutes);

// No route found error will be handled here
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

// This four param function will get executed in case of any error where first param is the error
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.iqpgp.mongodb.net/diet-plan?retryWrites=true&w=majority`,
    )
    .then(() => {
        console.log('Connected to db successfully!!!');
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
