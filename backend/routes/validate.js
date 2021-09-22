const express = require('express');
const validate = require('../services/validate');
const dvelop = require('../middleware/dvelop');


module.exports = function (assetBasePath, basePath) {
    const router = express.Router();

    router.use(dvelop.authenticate);

    router.post('/', async function (req, res, next) {
        const validationResult = await validate.validateDocuments(req.tenantId, req.body);
        res.send(validationResult);
    });

    return router;
};

