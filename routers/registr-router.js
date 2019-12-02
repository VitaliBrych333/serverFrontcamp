const express = require('express');
const User = require('../models/user-model');
const asyncHandler = require('../handdleMidleware/utils');
const logger = require('../logger/logger');
const router = new express.Router();

router.post(
  '/',
    asyncHandler(async (req, res) => {
        logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});

        let user = new User();
        user.username = req.body.username;
        user.password = req.body.password;

        let items = await User.find({username: user.username}).exec();

        if (items.length !== 0) {
            res.status(422).send(['Duplicate login found.']);
        } else {

            user.save((err, doc) => {
                if (!err) {
                  res.send(doc);
                } else {
                  return next(err);
                }
            });
        }
    })
);

module.exports = router;