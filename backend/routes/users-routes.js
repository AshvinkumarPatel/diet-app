const express = require('express');
const { check } = require('express-validator');

const {
    SIGN_UP_ENDPOINT,
    LOGIN_ENDPOINT,
    GET_USERS_LIST_ENDPOINT,
    UPDATE_DAILY_THRESHOLD_ENDPOINT,
    GET_USER_DETAILS,
} = require('../utils/constants');

const usersController = require('../controllers/users-controllers');

const router = express.Router();

router.get(GET_USERS_LIST_ENDPOINT, usersController.getUsers);

router.post(GET_USER_DETAILS, usersController.getUserDetails);

router.post(
    SIGN_UP_ENDPOINT,
    [
        check('firstName').not().isEmpty(),
        check('lastName').not().isEmpty(),
        check('email').isEmail(),
        check('password').isLength({ min: 6 }),
    ],
    usersController.signup,
);

router.post(LOGIN_ENDPOINT, usersController.login);

router.patch(
    UPDATE_DAILY_THRESHOLD_ENDPOINT,
    usersController.updateDailyThresHold,
);

module.exports = router;
