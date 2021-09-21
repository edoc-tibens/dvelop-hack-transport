const express = require('express');
const documents = require('../services/documents');
const dvelop = require('../middleware/dvelop');


module.exports = function (assetBasePath, basePath) {
    const router = express.Router();

    router.use(dvelop.authenticate);

    // ATTENTION: This page does not use the authenticate middleware meaning its publicly available

    router.post('/', async function (req, res, next) {
        await documents.send(req.tenantId, req.authSessionId, req.body);
        res.send(req.body);
    });

    return router;
};

