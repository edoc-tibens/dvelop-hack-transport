const express = require('express');

module.exports = function (assetBasePath, basePath, version) {
    const router = express.Router();

    // ATTENTION: This page does not use the authenticate middleware meaning its available

    router.get('/', function (req, res, next) {
        res.format({
            'application/hal+json': function () {
                res.send(
                    {
                        _links: {
                            featuresdescription: {
                                href: `${basePath}/features`
                            },
                            dmsobjectextensions: {
                                href: `${basePath}/dmsobjectextensions`
                            },
                            configfeatures : {
                                href : `${basePath}/configfeatures`
                            }, 
                        }
                    }
                )
            },
            'default': function () {
                res.status(406).send('Not Acceptable')
            }
        });
    });
    return router;
};

