const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user-model');
const confFacebook = require('../facebook-config/config');

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
				return done(null, user);
			}
		});
	})
);

passport.use(new FacebookStrategy({
	clientID: confFacebook.appID,
	clientSecret: confFacebook.appSecret,
	callbackURL: confFacebook.callbackUrl,
	profileFields:['id','displayName','emails']
	},
	(accessToken, refreshToken, profile, done) => {
		console.log('Your facebook profile', profile);

		let user = new User({
			username: profile.displayName,
			password: profile.emails[0].value,
		});
		
		User.findOne({username: user.username}, (err, res) => {
			if(!res) {
				user.save(function(err, user) {
					if(err) {
					    return done(err)
				    };
					done(null, user);
				});
			} else {
				done(null, res);
			}
		});
    }
));

passport.serializeUser(function(user, done) {
	done(null, user._id);
});
  
passport.deserializeUser(function(id, done) {
	User.findOne({_id: id}).then((user) => {
		done(null, user);
	});
});


