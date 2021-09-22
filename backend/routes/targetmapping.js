const express = require('express');
const mapping = require('../services/mapping');
const dvelop = require('../middleware/dvelop');

module.exports = function (assetBasePath, basePath) {
    const router = express.Router();

    router.use(dvelop.authenticate);

    // ATTENTION: This page does not use the authenticate middleware meaning its publicly available

    router.get('/', async function (req, res, next) {
        const mapping = await getTargetMapping('hackathon-dev-target.d-velop.cloud', authSessionID, repositoryId);
        res.send(mapping);
    });

    return router;
};

