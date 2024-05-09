const express = require("express");
const router = express.Router();
const Service = require('../models/ServiceModel');
const Account = require('../models/AccountModel');
const task = require('../plugins/Task');


async function listServices(req, res, next) {
    const query = req.query;
    const [e, reports] = await task(Service.find(query).sort({ created: -1 }).populate("user mechanic"));
    if (e) return next(e);
    req.rd = reports;
    return next();
}

async function getService(req, res, next) {
    const uid = req.params.uid;
    const [e, report] = await task(Service.findById(uid));
    if (e) return next(e);
    req.rd = report;
    return next();
}

async function newService(req, res, next) {
    const body = req.body;
    body.user = req.auth.uid;
    const [e, report] = await task(Service.create(body));
    if (e) return next(e);
    req.rd = report;
    return next();
}

async function updateService(req, res, next) {
    const uid = req.params.uid;
    const body = req.body;
    let mechUpdate = null;

    if (body.amount) mechUpdate = { $inc: { amount: body.amount } };
    else if (body.status == "Ongoing") mechUpdate = { $inc: { service: 1 } };
    else if (body.rating && body.rating > 0) mechUpdate = { $inc: { rating: body.rating } };


    const [e, report] = await task(Service.findByIdAndUpdate(uid, body));
    if (e) return next(e);

    if (mechUpdate) {
        const [e, mech] = await task(Account.findByIdAndUpdate(report.mechanic, mechUpdate));
        if (e) return next(e);
    }

    req.rd = report;
    return next();
}

async function deleteService(req, res, next) {
    const uid = req.params.uid;
    const [e, report] = await task(Service.findByIdAndDelete(uid));
    if (e) return next(e);
    req.rd = report;
    return next();
}



// routes
router.get("/list", listServices);
router.get("/one/:uid", getService);
router.post("/", newService);
router.put("/:uid", updateService);
router.delete("/:uid", deleteService);
module.exports = router;