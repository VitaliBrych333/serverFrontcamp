const mongoose = require('mongoose');
const { Types } = mongoose.Schema;

const newsSchema = new mongoose.Schema({
    title: Types.String,
});

module.exports = newsSchema;