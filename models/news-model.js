const mongoose = require('mongoose');
const newsSchema = require('../scheme/news-scheme');

const newsModel = mongoose.model('news', newsSchema, 'news');

module.exports = newsModel;