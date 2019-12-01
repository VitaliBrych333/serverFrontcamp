const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user-model');

passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' },
(username, password, done) => {
	User.findOne({ username: username }, (err, user) => {
		if (err) {
			return done(err);

		} else if (!user) {
			return done(null, false, { message: 'User name is not registered' });

		} else if (!user.verifyPassword(password)) {
			return done(null, false, { message: 'Wrong password.' });

		} else {
			// req.session.save();
			console.log('888888888888888')
			return done(null, user);
		}
	});
})
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne({where: {id}}).then((user) => {
    done(null, user);
    return null;
  });
});