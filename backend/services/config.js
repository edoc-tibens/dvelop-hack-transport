const fs = require('fs');
const path = require('path');

let basePath = path.join(`${__dirname}/../storage/config/`);

function getAPIKeyByBaseUri(tenantId, baseUri) {
    let tenantData = read(tenantId);

    tenantData.find((item) => {
        if (item.baseUri == baseUri) {
            return item.apiKey;
        }
    }
    );

    return false;
}

/**
 * Write config for a tenant
 * @param {*} tenantId 
 * @param {*} config 
 */
function write (tenantId, config) {
    let buffer = Buffer.from(JSON.stringify(config, null, 4), 'utf8');
    let tenantFile =  basePath + tenantId + ".json";
    fs.writeFile(tenantFile, buffer, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("file written");
        }
    });
}

/**
 * Read the config for a tenant
 * @param {*} tenantId 
 * @returns 
 */
function read(tenantId) {
    let tenantFile = basePath + tenantId + ".json";
    console.log(tenantFile);
    if (fs.existsSync(tenantFile)) {
        let fileContent = JSON.parse(fs.readFileSync(tenantFile, 'utf8'));
        return fileContent;
    } else {
        return {};
    }
}

/**
 * Read the config for a tenant without API-Key
 * @param {*} tenantId 
 * @returns 
 */
 function secureRead(tenantId) {
    let tenantFile = basePath + tenantId + ".json";
    console.log(tenantFile);
    if (fs.existsSync(tenantFile)) {
        let fileContent = JSON.parse(fs.readFileSync(tenantFile, 'utf8'));
        console.log(fileContent.map((entry) => ({title: entry.title, baseUri: entry.baseUri})));
        return fileContent.map((entry) => ({title: entry.title, baseUri: entry.baseUri}));
    } else {
        return {};
    }
}

module.exports = {read, secureRead, write, getAPIKeyByBaseUri}