const fs = require('fs');
const path = require('path');
const config = require('./config');

const axios = require('axios');

const login = require('@ablegroup/login');

let basePath = path.join(`${__dirname}/../storage/config/`);

/**
 * Send documents to another tenant
 */
async function send(tenantId, authSessionID, body) {
    console.log('Documenttransport started');
    const documentURL = body.documents;
    const targetTenant = body.tenant;
    const apiKey = config.getAPIKeyByBaseUri(tenantId, targetTenant.baseUri);
    const targetAuthSession = await login('https://' + targetTenant.baseUri, apiKey);
    const axiosOptions = {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${authSessionID}`
        }
    }
    await downloadDocuments(authSessionID, documentURL, axiosOptions);

    await downloadMetadata(authSessionID, documentURL, options);

    /**
     * * get list of documents
     * foreach : download, get attributes, upload,upload attributes
     */

    const targetRepositoryId = await getTargetRepoId(targetTenant.baseUri, targetAuthSession, axiosOptions);

    const contentLocations = await uploadPayload(targetTenant.baseUri, targetAuthSession, targetRepositoryId, {});

    await uploadMetadata(contentLocations, targetTenant.baseUri, targetAuthSession, targetRepositoryId, {});

    deleteLocalDocuments();

    console.log('Documenttransport finished');
}

async function downloadDocuments(authSessionID, documentURL, options) {
    const baseUri = 'https://edoc-tibens-dev.d-velop.cloud'; // TODO: Put me elsewhere
    options.url = baseUri + decodeURIComponent(documentURL).replace('2F', '/');
    try {
        const response = await axios(options);
        const documentHrefs = response.data.selectionList.map((doc) => doc._links.self.href);
        for (let i in documentHrefs) {
            options.url = `${baseUri}${documentHrefs[i]}/v/current/b/main/c`;
            options.responseType = 'stream';
            const documentResponse = await axios(options);
            const documentData = documentResponse.data;
            const fileName = decodeURIComponent(documentResponse.headers['content-disposition'].split(`''`)[1]);
            const filenameShort = fileName.split('(')[1];
            const filenameShortEnd = filenameShort.split(')')[0];
            const extension = fileName.split('.');
            documentData.pipe(fs.createWriteStream(path.join(__dirname, `../storage/documents/${filenameShortEnd}.${extension[extension.length - 1].toLowerCase()}`)));
        }
    } catch (err) {
        console.log(err);
    }
}

async function downloadMetadata(authSessionID, documentURL, options) {
    const baseUri = 'https://edoc-tibens-dev.d-velop.cloud'; // TODO: Put me elsewhere
    options.url = baseUri + decodeURIComponent(documentURL).replace('2F', '/');
    try {
        const response = await axios(options);
        const documentHrefs = response.data.selectionList.map((doc) => doc._links.self.href);
        for (let i in documentHrefs) {
            
        }
    } catch (err) {
        console.log(err);
    }
}

async function uploadPayload(baseUri, targetAuthSession, targetRepositoryId, options) {
    const folderContent = fs.readdirSync(path.join(__dirname, '../storage/documents'));
    const contentLocations = [];
    for (let i in folderContent) {
        options.url = `https://${baseUri}/dms/r/${targetRepositoryId}/blob/chunk`;
        options.responseType = 'blob';
        options.headers = { 'Content-Type': 'application/octet-stream', Authorization: `Bearer ${targetAuthSession}` };
        options.method = 'post';
        options.data = fs.readFileSync(path.join(__dirname, '../storage/documents', folderContent[i]));
        try {
            const response = await axios(options);
            contentLocations.push(response.headers.location);
        } catch (err) {
            console.log(err.message);
        }
    }
    return contentLocations;
}

async function uploadMetadata(contentLocations, baseUri, targetAuthSession, targetRepositoryId, options) {
    const folderContent = fs.readdirSync(path.join(__dirname, '../storage/documents'));
    for (let i in folderContent) {
        options.url = `https://${baseUri}/dms/r/${targetRepositoryId}/o2m`;
        options.responseType = 'blob';
        options.headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${targetAuthSession}` };
        options.method = 'post';
        options.data = {
            fileName: folderContent[i],
            sourceCategory: '5847e', // TODO
            sourceId: `/dms/r/${targetRepositoryId}/source`,
            contentLocationUri: contentLocations[i],
            sourceProperties: { // TODO
                properties: [{
                    key: "6",
                    values: ["516615"]
                }
            ],
            }
        };
        try {
            const response = await axios(options);
        } catch (err) {
            console.log(err.message);
        }
    }
}

async function getTargetRepoId(baseUri, targetAuthSession, options) {
    const localOptions = JSON.parse(JSON.stringify(options));
    localOptions.url = 'https://' + baseUri + '/dms/r';
    localOptions.responseType = 'blob';
    localOptions.headers.Authorization = `Bearer ${targetAuthSession}`;
    try {
        const response = await axios(localOptions);
        return response.data.repositories[0].id;
    } catch (err) {
        console.log(err.message);
    }
}

function deleteLocalDocuments() {
    const folderContent = fs.readdirSync(path.join(__dirname, '../storage/documents'));
    for (let i in folderContent) {
        fs.unlinkSync(path.join(__dirname, '../storage/documents', folderContent[i]));
    }
}

module.exports = { send }