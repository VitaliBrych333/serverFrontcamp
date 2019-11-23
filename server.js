const express = require('express');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const logger = require('./logger/logger');
const router = require('./routers/router');
const cors = require('cors');
const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('port', (process.env.PORT || 5500));

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use('/', router);

app.use((err, req, res, next) => {
    logger.log({ level: 'info', message: `ERROR: ${err.message} - ${req.method}: URL - ${req.url}`});
    res.status(500).render('error', {contentError: `Error: ${err.message}`})
});

app.listen(app.get('port'), () => {
    console.log('Node app is running at localhost:' + app.get('port'));
});
