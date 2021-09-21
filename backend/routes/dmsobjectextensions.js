const express = require('express');

module.exports = function (assetBasePath, basePath) {
    const router = express.Router();

    // ATTENTION: This page does not use the authenticate middleware meaning its publicly available

    router.get('/', function (req, res, next) {
        res.format({
            'application/hal+json': function () {
                res.send(
                    {
                        extensions: [
                        {
                            id: "hackathon-demo.exportDocuments",
                            activationConditions: [{
                                "propertyId": "repository.id",
                                "operator": "or",
                                "values": ["b92263d3-9349-4285-984b-fedbb9ceddde"]
                            }],
                            captions: [{
                                "culture": "de",
                                "caption": "Dokumente exportieren"
                            },
                            {
                                culture: "en",
                                caption: "Export documents"
                            }],
                            context: "DmsObjectListContextAction",
                            uriTemplate: `${basePath}/ui/#/sendDocuments?url={dmsobjectlist.url}`,
                            iconUri: `${assetBasePath}/appIcon.png`
                        }]
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

