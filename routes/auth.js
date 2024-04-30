const express = require("express");
const router = express.Router();
const Account = require("../models/AccountModel");
const Auth = require("../plugins/Auth");
const task = require("../plugins/Task");
const is = require("../plugins/IS");

function Token(account) {
    let sign = { uid: account._id, type: account.type, name: account.name };
    let token = Auth.generateToken(sign);
    return token;
}

async function oneLogin(req, res, next) {
    const phone = req.body.phone;
    const pass = req.body.pass;

    console.log(req.auth);

    let token = null;
    if (!phone || !pass) return next(is.e.badReq);

    const [e, account] = await task(Account.findOne({ phone: phone }).select('+pass'));
    console.log(account)

    if (account) {
        if (account.pass !== pass) return next(is.e.wrongPass);
        token = Token(account);
        req.rd = { account: account, token: token };
    }
    if (!account) {
        if (!req.body.name) {
            req.rd = { incomplete: true };
            return next();
        }

        const [e, newAccount] = await task(Account.create(req.body));
        if (e) return next(e);
        token = Token(newAccount);
        req.rd = { account: newAccount, token: token };
    }

    return next();
}

router.post("/one", oneLogin);
module.exports = router;