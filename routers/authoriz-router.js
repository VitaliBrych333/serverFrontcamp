const express = require('express');
const asyncHandler = require('../handdleMidleware/utils');
const router = new express.Router();

const passport = require('passport');
const authenticate = passport.authenticate('local', {session: true});
router.post(
  '/', authenticate,
  asyncHandler(async (req, res) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.log('1111111111', err)
        return res.status(400).json(err);

      } else if (user) {
        console.log('222222222222',)
        return res.status(200).json({ 'token': user });
        
      } else {
        console.log('333333333333')
        return res.status(404).json(info);
      }
    })(req, res);
  })
);

module.exports = router;