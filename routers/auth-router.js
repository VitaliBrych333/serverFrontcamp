const express = require('express');
const router = new express.Router();
const passport = require('passport');

router.get(
    '/facebook', 
    passport.authenticate('facebook')
);

router.get(
    '/facebook/callback', 
    passport.authenticate('facebook', { successRedirect: '/authorization', failureRedirect: '/registration' })
);

module.exports = router;
