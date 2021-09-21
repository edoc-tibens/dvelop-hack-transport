const express = require('express');
const config = require('../services/config');

module.exports = function (assetBasePath, basePath) {
    const router = express.Router();

    // ATTENTION: This page does not use the authenticate middleware meaning its publicly available

    router.post('/', function (req, res, next) {
        console.log(req.body);
        config.write(req.tenantId, req.body);
        res.send(req.body);
    });

    router.get('/', function (req, res, next) {
        res.send(config.read(req.tenantId));
    });

    router.get('/secure', function (req, res, next) {
        res.send(config.secureRead(req.tenantId));
    });
    return router;
};

