const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dvelop = require('./middleware/dvelop');
//const bodyParser = require('body-parser');

const appName = "hackathon-demo";
const basePath = "/" + appName;
const assetBasePath = process.env.ASSET_BASE_PATH || `/${appName}/assets`;
const version = process.env.BUILD_VERSION || '1.0.0';


const rootRouter = require('./routes/root')(assetBasePath, basePath, version);
const dmsobjectextensionsRouter = require('./routes/dmsobjectextensions')(assetBasePath, basePath);
const configRouter = require('./routes/config')(assetBasePath, basePath);
const documentsRouter = require('./routes/documents')(assetBasePath, basePath);
const configFeaturesRouter = require('./routes/configfeatures')(assetBasePath, basePath);

const app = express();

//app.use(bodyParser.json({type: 'application/*+json'}));
app.use(assetBasePath, express.static(`${__dirname}/../public`));
app.use(`${basePath}/ui`, express.static(path.join(`${__dirname}/../dist/spa`)));


app.locals.base = basePath;

app.use(dvelop.setContext);
//app.use(dvelop.validateRequestSignature) // ATTENTION: This middleware should be commented in for every request once the app runs within d.velop context

app.use(express.json({ type: ['application/json', 'application/*+json'] }));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(basePath + '/', rootRouter);
app.use(basePath + '/dmsobjectextensions', dmsobjectextensionsRouter);
app.use(basePath + '/config', configRouter);
app.use(basePath + '/documents', documentsRouter);
app.use(basePath + '/configfeatures', configFeaturesRouter);

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.error(err.message);

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

app.listen(5001, () => { console.log('Started') });
