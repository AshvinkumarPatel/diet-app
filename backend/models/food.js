const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const foodSchema = new Schema({
    productName: { type: String, required: true },
    timeConsumed: { type: Date, required: true },
    calorie: { type: Number, required: true },
    isCheatFood: { type: Boolean, default: false },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = mongoose.model('Food', foodSchema);
