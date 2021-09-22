const axios = require('axios');
const login = require('@ablegroup/login');
const config = require('./config');

async function getTargetMapping(baseUri, authSessionID, repositoryId) {
    const options = {
        method: 'get',
        url: `https://${baseUri}/dms/r/${repositoryId}/objdef`,
        headers: {
            'Authorization': `Bearer ${authSessionID}`,
            'Accept-Language': 'de'
        }
    };
    const response = await axios(options);
    return response.data;
}

async function getTargetRepoId(baseUri, targetAuthSession, options) {
    options.url = 'https://' + baseUri + '/dms/r';
    options.responseType = 'blob';
    options.headers = { Authorization: `Bearer ${targetAuthSession}`};
    options.method = 'get';
    try {
        const response = await axios(options);
        return response.data.repositories[0].id;
    } catch (err) {
        console.log(err.message);
    }
}

async function validateDocuments(tenantId, body) {
    const invalidProperties = [];
    const documentMetas = body.documents;
    const targetTenant = body.tenant;
    const apiKey = config.getAPIKeyByBaseUri(tenantId, targetTenant.baseUri);
    const targetAuthSession = await login('https://' + targetTenant.baseUri, apiKey);
    const targetRepositoryId = await getTargetRepoId(targetTenant.baseUri, targetAuthSession, {});
    const targetMapping = await getTargetMapping(targetTenant.baseUri, targetAuthSession, targetRepositoryId);
    for (let j in documentMetas) {
        const documentMeta = documentMetas[j];

        for (let i in documentMeta.objectProperties) {
            const docProp = documentMeta.objectProperties[i];
            const category = targetMapping.objectDefinitions.find((obj) => obj.displayName === documentMeta.category);
            const foundTargetProperty = category.propertyFields.find((targetProp) => targetProp.displayName === docProp.name);
            if (foundTargetProperty == undefined) {
                invalidProperties.push({ propertyID: docProp.id, category: documentMeta.category });
            }
        }

    }
    return invalidProperties;
}

module.exports = { validateDocuments }