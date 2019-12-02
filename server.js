require('./passport/config');
const express = require('express');
const mongoose = require('mongoose');
const exphbs  = require('express-handlebars');
const logger = require('./logger/logger');
const authorizRouter = require('./routers/authoriz-router');
const registrRouter = require('./routers/registr-router');
const router = require('./routers/router');
const passport = require('passport');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);

mongoose.connect(
    'mongodb://admin:admin2019@ds043168.mlab.com:43168/frontcamp',
    { useNewUrlParser: true, useFindAndModify: false},
);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('port', (process.env.PORT || 5500));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'hghtyNN23h',
    store: new FileStore(),
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
    },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

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
