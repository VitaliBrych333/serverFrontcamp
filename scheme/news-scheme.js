const mongoose = require('mongoose');
const { Types } = mongoose.Schema;

const newsSchema = new mongoose.Schema({
  title: Types.String,
});

newsSchema.statics.findOneOrCreate = async function findOneOrCreate(condition) {
  let news = await this.findOne(condition);
  if (!news) {
    news = await this.create(condition);
  }
  return news;
};

module.exports = newsSchema;