const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    token: { type: String },
    isAdmin: { type: Boolean },
    foods: [{ type: mongoose.Types.ObjectId, ref: 'Food' }],
    dailyThreshold: { type: Number, default: 2100 },
});

module.exports = mongoose.model('User', userSchema);
