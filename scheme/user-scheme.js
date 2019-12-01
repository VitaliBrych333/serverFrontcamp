const mongoose = require('mongoose');
const { Types } = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: Types.String,
  password: Types.String,
});

userSchema.pre('save', (next) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      this.password = hash;
      this.saltSecret = salt;
      next();
    });
  });
});

userSchema.statics.findOneOrCreate = async function findOneOrCreate(condition) {
  let user = await this.findOne(condition);
  if (!user) {
    user = await this.create(condition);
  }
  return user;
};

userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = userSchema;
