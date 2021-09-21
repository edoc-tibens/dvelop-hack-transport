const fs = require('fs');
const path = require('path');
const config = require('./config');

const axios = require('axios');

let basePath = path.join(`${__dirname}/../storage/config/`);

/**
 * Send documents to another tenant
 */
async function send(tenantId, authSessionID, body) {
    const documentURL = body.documents;
    const targetTenant = body.tenant;
    const apiKey = config.getAPIKeyByBaseUri(tenantId, targetTenant);
    const axiosOptions = {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${authSessionID}`
        }
    }
    console.log(axiosOptions.headers.Authorization);
    const documents = await downloadDocuments(authSessionID, documentURL, axiosOptions);

    /*
        TODO
        * Download document payload and metadata from source tenant
        * Upload document payload
        * Upload document metadata
    */
}

async function downloadDocuments(authSessionID, documentURL, options) {
    options.url = 'https://edoc-tibens-dev.d-velop.cloud' + documentURL;
    console.log(options.url);
    try {
        const response = await axios(options);
        console.log(response.data);
    } catch (err) {
        console.log(err);
    }
}

async function uploadPayload() {

}

async function uploadMetadata() {

}

module.exports = { send }