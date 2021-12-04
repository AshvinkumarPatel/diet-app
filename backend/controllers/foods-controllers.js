const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Food = require('../models/food');
const User = require('../models/user');

const getAllFoodsList = async (req, res, next) => {
    let foodsList;
    try {
        foodsList = await Food.find({})
            .populate('creator', '_id firstName lastName email')
            .exec();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a food list.',
            500,
        );
        return next(error);
    }

    if (!foodsList) {
        const error = new HttpError(
            'Could not find food entries of any user.',
            404,
        );
        return next(error);
    }
    res.json([...foodsList.map((user) => user.toObject({ getters: true }))]);
};

const getFoodById = async (req, res, next) => {
    const foodId = req.params.fid;

    let food;
    try {
        food = await Food.findById(foodId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a food.',
            500,
        );
        return next(error);
    }

    if (!food) {
        const error = new HttpError(
            'Could not find food for the provided id.',
            404,
        );
        return next(error);
    }

    res.json({ food: food.toObject({ getters: true }) });
};

const getFoodsByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let userWithFoods;
    try {
        // userWithFoods = await User.findById(userId).populate('foods');
        // OR
        userWithFoods = await Food.find({ creator: userId }).sort({
            timeConsumed: -1,
        });
    } catch (err) {
        const error = new HttpError(
            'Fetching foods failed, please try again later.',
            500,
        );
        return next(error);
    }

    if (!userWithFoods || userWithFoods.length === 0) {
        return next(
            new HttpError(
                'Could not find foods for the provided user id.',
                404,
            ),
        );
    }

    res.json(userWithFoods.map((food) => food.toObject({ getters: true })));
};

const createFood = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError(
                'Invalid inputs passed, please check your data.',
                422,
            ),
        );
    }

    const { productName, calorie, timeConsumed, creator, isCheatFood } =
        req.body;

    const createdFood = new Food({
        productName,
        calorie,
        timeConsumed,
        creator,
        isCheatFood,
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError(
            'Creating food failed, please try again.',
            500,
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError(
            'Could not find user for provided id.',
            404,
        );
        return next(error);
    }

    try {
        await createdFood.save();
    } catch (err) {
        const error = new HttpError(
            'Creating food failed, please try again.',
            500,
        );
        return next(error);
    }

    res.status(201).json({
        food: {
            ...createdFood.toObject({ getters: true }),
            creator: user.toObject({ getters: true }),
        },
    });
};

const updateFood = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError(
                'Invalid inputs passed, please check your data.',
                422,
            ),
        );
    }

    const { productName, timeConsumed, calorie, isCheatFood } = req.body;
    const foodId = req.params.fid;

    let food;
    try {
        food = await Food.findById(foodId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update food.',
            500,
        );
        return next(error);
    }

    food.productName = productName;
    food.timeConsumed = timeConsumed;
    food.calorie = calorie;
    food.isCheatFood = isCheatFood;

    try {
        await food.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update food.',
            500,
        );
        return next(error);
    }

    res.status(200).json({ ...food.toObject({ getters: true }) });
};

const deleteFood = async (req, res, next) => {
    const foodIds = req.body.foodIds;
    let food;
    try {
        food = await Food.deleteMany({ _id: { $in: foodIds } });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete food.',
            500,
        );
        return next(error);
    }
    console.log('$$$$$$ ', food);
    if (!food) {
        const error = new HttpError('Could not find food for this id.', 404);
        return next(error);
    }

    // try {
    //     console.log('#######', food);
    //     const sess = await mongoose.startSession();
    //     sess.startTransaction();
    //     // await food.remove({ session: sess });
    //     food.creator.foods.pull(food);
    //     await food.creator.save({ session: sess });
    //     await sess.commitTransaction();
    // } catch (err) {
    //     console.log('Error', err);
    //     const error = new HttpError(
    //         'Something went wrong, could not delete food.',
    //         500,
    //     );
    //     return next(error);
    // }

    res.status(200).json({ message: 'Deleted food.', deleteFoodIds: foodIds });
};

exports.getFoodById = getFoodById;
exports.getAllFoodsList = getAllFoodsList;
exports.getFoodsByUserId = getFoodsByUserId;
exports.createFood = createFood;
exports.updateFood = updateFood;
exports.deleteFood = deleteFood;
