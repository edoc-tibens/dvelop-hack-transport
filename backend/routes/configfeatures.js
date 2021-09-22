const express = require('express');
const config = require('../services/config');

module.exports = function (assetBasePath, basePath) {
    const router = express.Router();

    // ATTENTION: This page does not use the authenticate middleware meaning its publicly available

    router.get('/', function (req, res, next) {
        let tenantConfig = config.read(req.tenantId);

        res.format({
            'application/hal+json': function () {
                res.send(
                    {
                        appName: "hackathon-demo",
                        customHeadlines: [
                            {
                                caption: "Dokumententransport",
                                description: "<description of your configuration option>",
                                menuItems: [{
                                    caption: "Tenanten und API-Keys",
                                    description: "Setzen Sie Ihre Tenanten und API-Keys für den Transport von Dokumenten",
                                    href: `${basePath}/ui/#/config`,
                                    keywords: ["Transport", "Dokument"],
                                    configurationState: (tenantConfig.length > 0) ? 0 : 1
                                }
                                ],
                                "categories": [{
                                    id: "b404c8f8-8d56-4861-b847-fcfc7eec0ba2",
                                    caption: "Dokumentenverwaltung"
                                }
                                ]
                            }
                        ]
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

