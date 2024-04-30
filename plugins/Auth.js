'use strict'
const task = require("../plugins/Task");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const jwtSecret = "secret14";

async function verifyLogin(model, phone, pass) {
    if (!pass) throw new Error("#400 Password is required.");
    if (!phone) throw new Error("#400 User uid is required.");
    const [e, account] = await task(model.findOne({ phone }).select('+pass'));
    if (e && !e.nf) throw new Error(e);
    if (e && e.nf) throw new Error("#404 Account not found.");

    let [er, passMatched] = await task(bcrypt.compare(pass, account.pass));
    if (er && !er.nf) throw new Error(er);
    delete account.pass;
    if (passMatched) return account;
    else throw new Error("#403 Wrong Password!");
}

function generateToken(signature, expiryTime) {
    let key = jwt.sign(signature, jwtSecret);
    if (expiryTime) key = jwt.sign(signature, jwtSecret, { expiresIn: expiryTime });
    let responseObj = { key: key };
    return responseObj;
}

async function decrypt(token, key) {
    if (!key) key = jwtSecret;
    try {
        const decoded = await jwt.verify(token, key);
        return decoded;
    }
    catch (e) {
        return false;
    }
}

async function verifyToken(req, res, next) {
    let token = req.header('x-auth-token');
    if (!token) { req.auth = false; return next(); }
    const decoded = await decrypt(token);
    if (!decoded) return next(new Error("#403 Token authenticaton failed!"));
    req.auth = decoded;
    return next();
}

module.exports.verifyLogin = verifyLogin;
module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;
module.exports.decryptToken = decrypt;