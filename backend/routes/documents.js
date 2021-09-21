const express = require('express');
const documents = require('../services/documents');

module.exports = function (assetBasePath, basePath) {
    const router = express.Router();

    // ATTENTION: This page does not use the authenticate middleware meaning its publicly available

    router.post('/', async function (req, res, next) {
        console.log(req.body);
        await documents.send(req.tenantId, req.body);
        res.send(req.body);
    });

    return router;
};

