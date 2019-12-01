const mongoose = require('mongoose');
const userSchema = require('../scheme/user-scheme');

const userModel = mongoose.model('users', userSchema, 'users');

module.exports = userModel;