const axios = require('axios');

async function getTargetMapping(baseUri, authSessionID, repositoryId) {
    const options = {
        method: 'get',
        url: `https://${baseUri}/dms/r/${repositoryId}/objdef`,
        headers: {
            'Authorization': `Bearer ${authSessionID}`
        }
    };
    const response = await axios(options);
    return response.data;
}

async function findTargetCategoryByName(metadata, baseUri, authSessionID, repositoryId) {
    const targetMapping = await getTargetMapping(baseUri, authSessionID, repositoryId);
    const category = targetMapping.objectDefinitions.find((obj) => obj.displayName === metadata.category);
    return category.id;
}

async function createSourceProperties(metadata, baseUri, authSessionID, repositoryId) {
    const properties = [];
    const targetMapping = await getTargetMapping(baseUri, authSessionID, repositoryId); 
    const category = targetMapping.objectDefinitions.find((obj) => obj.displayName === metadata.category);
    metadata.objectProperties.forEach((objProp) => {
        const matchedProperty = category.propertyFields.find((catProp) => catProp.displayName === objProp.name);
        if(matchedProperty) {
            properties.push({
                key: matchedProperty.id,
                values: [objProp.value]
            })
        }
    });
    return { properties };
    
}

module.exports = { findTargetCategoryByName, createSourceProperties }
