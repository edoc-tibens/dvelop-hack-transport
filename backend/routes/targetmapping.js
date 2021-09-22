const express = require('express');
const fs = require('fs');
const path = require('path');
const dvelop = require('../middleware/dvelop');

module.exports = function (assetBasePath, basePath) {
    const router = express.Router();

    router.use(dvelop.authenticate);

    // ATTENTION: This page does not use the authenticate middleware meaning its publicly available

    router.get('/', async function (req, res, next) {
        const mapping = JSON.parse(fs.readFileSync(path.join(__dirname, '../storage/mapping.json')));
        res.send(mapping);
    });

    return router;
};

