const express = require('express');
const { check } = require('express-validator');

const {
    CREATE_FOOD,
    GET_FOODS_LIST_BY_USER_ID,
    UPDATE_FOOD,
    DELETE_FOOD,
    GET_FOOD_DETAILS,
    GET_ALL_FOODS_LIST,
} = require('../utils/constants');
const foodsController = require('../controllers/foods-controllers');

const router = express.Router();

router.get(GET_ALL_FOODS_LIST, foodsController.getAllFoodsList);

router.get(GET_FOOD_DETAILS, foodsController.getFoodById);

router.get(GET_FOODS_LIST_BY_USER_ID, foodsController.getFoodsByUserId);

router.post(
    CREATE_FOOD,
    [
        check('productName').not().isEmpty(),
        check('calorie').isNumeric(),
        check('timeConsumed').not().isEmpty(),
    ],
    foodsController.createFood,
);

router.patch(
    UPDATE_FOOD,
    [
        check('productName').not().isEmpty(),
        check('calorie').isNumeric(),
        check('timeConsumed').not().isEmpty(),
    ],
    foodsController.updateFood,
);

router.delete(DELETE_FOOD, foodsController.deleteFood);

module.exports = router;
