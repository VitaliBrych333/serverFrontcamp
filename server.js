require('./passport/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const logger = require('./logger/logger');
const authorizRouter = require('./routers/authoriz-router');
const registrRouter = require('./routers/registr-router');
const router = require('./routers/router');
const cors = require('cors');
const passport = require('passport');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const User = require('./models/user-model');
const MongoStore = require('connect-mongo')(session);
mongoose.connect(
    'mongodb://admin:admin2019@ds043168.mlab.com:43168/frontcamp',
    { useNewUrlParser: true, useFindAndModify: false},
);

// app.use(cookieParser());
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('port', (process.env.PORT || 5500));

app.use(cookieParser());
app.use(session({
  store: new MongoStore({
    url: 'mongodb://admin:admin2019@ds043168.mlab.com:43168/frontcamp',
    collection: 'sessions'
  }),
  secret: 'secret',
  resave: true,
  rolling: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 10 * 60 * 1000,
    httpOnly: false,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

// app.use(passport.initialize());
// app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

app.use('/registration', registrRouter);
app.use('/authorization', authorizRouter);
app.use('/', router);


app.use((err, req, res, next) => {
    logger.log({ level: 'info', message: `ERROR: ${err.message} - ${req.method}: URL - ${req.url}`});
    res.status(500).render('error', {contentError: `Error: ${err.message}`})
});

app.listen(app.get('port'), () => {
    console.log('Node app is running at localhost:' + app.get('port'));
});
