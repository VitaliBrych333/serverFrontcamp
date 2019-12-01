const express = require('express');
const User = require('../models/user-model');
const asyncHandler = require('../handdleMidleware/utils');

const router = new express.Router();

router.post(
  '/',
  asyncHandler(async (req, res) => {
    let user = new User();
    user.login = req.body.login;
    user.password = req.body.password;
    user.save((err, doc) => {
      if (!err) {
        res.send(doc);

      } else {
        if (err.code == 11000) {
          res.status(422).send(['Duplicate login found.']);
          
        } else {
          return next(err);
        }
      }
    });
  })
);

module.exports = router;