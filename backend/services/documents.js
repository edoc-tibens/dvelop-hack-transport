const fs = require('fs');
const path = require('path');
const config = require('./config');

let basePath = path.join(`${__dirname}/../storage/config/`);

/**
 * Send documents to another tenant
 */
async function send(tenantId, authSessionID, body) {
    const documentIDs = body.documents;
    const targetTenant = body.tenant;
    const apiKey = config.getAPIKeyByBaseUri(tenantId, targetTenant);
    const documents = await downloadDocuments(authSessionID, documentIDs);

    /*
        TODO
        * Download document payload and metadata from source tenant
        * Upload document payload
        * Upload document metadata
    */
}

async function downloadDocuments(authSessionID, documentIDs) {

}

async function uploadPayload() {

}

async function uploadMetadata() {

}

module.exports = { send }