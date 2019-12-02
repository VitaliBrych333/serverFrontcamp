const express = require('express');
const asyncHandler = require('../handdleMidleware/utils');
const router = new express.Router();
const passport = require('passport');
const logger = require('../logger/logger');

router.post(
    '/', 
    asyncHandler(async (req, res) => {
        passport.authenticate('local', (err, user, info) => {
            logger.log({ level: 'info', message: `${req.method}: URL - ${req.url}`});

            if (err) {
                return res.status(400).json(err);

            } else if (user) {     
                // or    return res.status(200).json({'token': user });
                  req.logIn(user, function(err) {
                      if (err) { return next(err);}
                      return res.redirect('/news');
                  });  
            } else {
                // or    res.redirect('/registration');
                return res.status(404).json(info);
            }
        })(req, res);
    })
);

module.exports = router;