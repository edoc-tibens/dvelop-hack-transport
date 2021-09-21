const appRouter = require("@dvelop-sdk/app-router");
const idp = require("@dvelop-sdk/identityprovider");

function setContext(req, res, next) {
    req.systemBaseUri = req.get(appRouter.DVELOP_SYSTEM_BASE_URI_HEADER) || process.env.systemBaseUri;
    req.tenantId = req.get(appRouter.DVELOP_TENANT_ID_HEADER) || 0;
    req.requestId = req.get(appRouter.DVELOP_REQUEST_ID_HEADER) || appRouter.generateRequestId();
    next();
}

function validateRequestSignature(req, res, next) {
    try {
        const requestSignature = req.get(appRouter.DVELOP_REQUEST_SIGNATURE_HEADER);

        // ATTENTION: The RequestSignature should always be validated. Invalid RequestSiganuters might be a security risk.
        appRouter.validateRequestSignature(process.env.SIGNATURE_SECRET, req.systemBaseUri, req.tenantId, requestSignature);
        next();
    } catch(e) {
        res.status(401).send("Forbidden");
    }
}

async function authenticate(req, res, next) {

    try {
        const authSessionId = getAuthSessionId(req);
        const principal = await idp.validateAuthSessionId(req.systemBaseUri, authSessionId);
        req.principal = principal;
        next();
    } catch (e) {
        console.error(e);
        rejectRequest(req, res);
    }
}

function getAuthSessionId(req) {
    const authorizationHeader = req.get("Authorization");
    const bearerTokenRegex = RegExp('^bearer (.*)$', "i"); // cf. https://regex101.com/
    const matches = bearerTokenRegex.exec(authorizationHeader);
    if (matches !== null) {
        return matches[1];
    }
    if (req.cookies["AuthSessionId"]) {
        return req.cookies["AuthSessionId"];
    }
    throw "No AuthSessionId found in request"
}

function rejectRequest(req, res) {

    res.format({
        'text/html': function () {
            res.redirect(idp.getLoginRedirectionUri(req.originalUrl))
        },
        'default': function () {
            res.status(401).send('Unauthorized')
        }
    });
}

module.exports = { setContext, validateRequestSignature, authenticate }