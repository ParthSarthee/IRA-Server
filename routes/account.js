const express = require("express");
const router = express.Router();
const Account = require('../models/AccountModel');
const task = require('../plugins/Task');


async function listAccounts(req, res, next) {
    const query = req.query;
    const [e, accounts] = await task(Account.find(query).sort({ created: -1 }));
    if (e) return next(e);
    req.rd = accounts;
    return next();
}

async function getAccount(req, res, next) {
    const uid = req.params.uid;
    const [e, account] = await task(Account.findById(uid));
    if (e) return next(e);
    req.rd = account;
    return next();
}

async function newAccount(req, res, next) {
    const body = req.body;
    const [e, account] = await task(Account.create(body));
    if (e) return next(e);
    req.rd = account;
    return next();
}

async function updateAccount(req, res, next) {
    const uid = req.params.uid;
    const body = req.body;
    const [e, account] = await task(Account.findByIdAndUpdate(uid
        , body
        , { new: true }));
    if (e) return next(e);
    req.rd = account;
    return next();
}

async function deleteAccount(req, res, next) {
    const uid = req.params.uid;
    const [e, account] = await task(Account.findByIdAndDelete(uid));
    if (e) return next(e);
    req.rd = account;
    return next();
}



// routes
router.get("/list", listAccounts);
router.get("/one/:uid", getAccount);
router.post("/", newAccount);
router.put("/:uid", updateAccount);
router.delete("/:uid", deleteAccount);
module.exports = router;