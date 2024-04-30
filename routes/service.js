const express = require("express");
const router = express.Router();
const Service = require('../models/ServiceModel');
const task = require('../plugins/Task');


async function listServices(req, res, next) {
    const query = req.query;
    const [e, reports] = await task(Service.find(query).sort({ created: -1 }));
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
    const [e, report] = await task(Service.create(body));
    if (e) return next(e);
    req.rd = report;
    return next();
}

async function updateService(req, res, next) {
    const uid = req.params.uid;
    const body = req.body;
    const [e, report] = await task(Service.findByIdAndUpdate(uid
        , body
        , { new: true }));
    if (e) return next(e);
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