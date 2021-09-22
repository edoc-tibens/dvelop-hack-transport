const fs = require('fs');
const path = require('path');
const axios = require('axios');
const login = require('@ablegroup/login');

const config = require('./config');
const mapping = require('./mapping');

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

    await downloadMetadata(authSessionID, documentURL, axiosOptions);

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
    options.responseType = 'json';
    options.method = 'get';
    try {
        const response = await axios(options);
        const documentHrefs = response.data.selectionList.map((doc) => doc._links.self.href);
        for (let i in documentHrefs) {
            options.url = baseUri + documentHrefs[i];
            const documentResponse = await axios(options);
            const documentMeta = documentResponse.data;
            fs.writeFileSync(path.join(__dirname, `../storage/metadata/${documentMeta.id}.json`), JSON.stringify(documentMeta, null, 2));
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
    const documentFolderContent = fs.readdirSync(path.join(__dirname, '../storage/documents'));
    const metadataFolderContent = fs.readdirSync(path.join(__dirname, '../storage/metadata'));
    for (let i in documentFolderContent) {
        const metadata = JSON.parse(fs.readFileSync(path.join(__dirname, '../storage/metadata', metadataFolderContent[i])));
        options.url = `https://${baseUri}/dms/r/${targetRepositoryId}/o2m`;
        options.responseType = 'blob';
        options.headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${targetAuthSession}` };
        options.method = 'post';
        options.data = {
            fileName: documentFolderContent[i],
            sourceCategory: await mapping.findTargetCategoryByName(metadata, baseUri, targetAuthSession, targetRepositoryId),
            sourceId: `/dms/r/${targetRepositoryId}/source`,
            contentLocationUri: contentLocations[i],
            sourceProperties: await mapping.createSourceProperties(metadata, baseUri, targetAuthSession, targetRepositoryId) 
        };
        try {
            const response = await axios(options);
        } catch (err) {
            console.log(err);
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
    const documentFolderContent = fs.readdirSync(path.join(__dirname, '../storage/documents'));
    for (let i in documentFolderContent) {
        fs.unlinkSync(path.join(__dirname, '../storage/documents', documentFolderContent[i]));
    }
    const metaFolderContent = fs.readdirSync(path.join(__dirname, '../storage/metadata'));
    for (let i in metaFolderContent) {
        fs.unlinkSync(path.join(__dirname, '../storage/metadata', metaFolderContent[i]));
    }
}

module.exports = { send }