const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const generateToken = require('../utils');

const getUsers = async (req, res, next) => {
    let users;
    try {
        // return users details which are not admin
        users = await User.find({ isAdmin: { $ne: true } }, '-password');
    } catch (err) {
        const error = new HttpError(
            'Fetching users failed, please try again later.',
            500,
        );
        return next(error);
    }
    res.json([...users.map((user) => user.toObject({ getters: true }))]);
};

const getUserDetails = async (req, res, next) => {
    const userId = req.user.id;

    let existingUser;
    try {
        existingUser = await User.findById(userId);
    } catch (err) {
        const error = new HttpError(
            'No user found, please try again later.',
            500,
        );
        return next(error);
    }

    // delete password from response
    const userObject = {
        ...existingUser.toObject({ getters: true }),
    };
    delete userObject.password;

    res.json(userObject);
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError(
                'Invalid inputs passed, please check your data.',
                422,
            ),
        );
    }

    const { firstName, lastName, email, password } = req.body;

    // check if user already exist
    // Validate if user exist in our database
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email.toLowerCase() });
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500,
        );
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
            'User exists already, please login instead.',
            422,
        );
        return next(error);
    }

    let encryptedPassword;
    try {
        // Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
        const error = new HttpError('Encryption failed.', 500);
        return next(error);
    }

    const createdUser = new User({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: encryptedPassword,
        foods: [],
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500,
        );
        return next(error);
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const updateDailyThresHold = async (req, res, next) => {
    const { userId, dailyThreshold } = req.body;

    let existingUser;
    try {
        existingUser = await User.findById(userId);
    } catch (err) {
        const error = new HttpError(
            'No user found, please try again later.',
            500,
        );
        return next(error);
    }

    // save daily threshold
    existingUser.dailyThreshold = dailyThreshold;
    try {
        await existingUser.save();
    } catch (err) {
        const error = new HttpError(
            'Update daily threshold failed, please try again later.',
            500,
        );
        return next(error);
    }

    res.status(200).json({ user: existingUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Loggin in failed, please try again later.',
            500,
        );
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError('User does not exists.', 404);
        return next(error);
    }

    if (!(await bcrypt.compare(password, existingUser.password))) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            401,
        );
        return next(error);
    }

    // Create token
    existingUser.token = generateToken(existingUser);

    // delete password from response
    const userObject = {
        ...existingUser.toObject({ getters: true }),
    };
    delete userObject.password;

    res.json(userObject);
};

exports.getUsers = getUsers;
exports.getUserDetails = getUserDetails;
exports.signup = signup;
exports.login = login;
exports.updateDailyThresHold = updateDailyThresHold;
