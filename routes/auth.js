const express = require("express");
const router = express.Router();
const Account = require("../models/AccountModel");
const Service = require("../models/ServiceModel");
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

    let token = null;
    if (!phone || !pass) return next(is.e.badReq);

    const [e, account] = await task(Account.findOne({ phone: phone }).select('+pass'));

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

async function adminData(req, res, next) {

    const pipeline = [{ $group: { _id: null, totalAmount: { $sum: '$amount' } } }];
    const [e, amount] = await task(Service.aggregate(pipeline));
    if (e) return next(e);

    const [e1, service] = await task(Service.countDocuments());
    if (e1) return next(e1);

    const [e2, mechanic] = await task(Account.countDocuments({ type: 'mechanic' }));
    if (e2) return next(e2);

    const [e3, user] = await task(Account.countDocuments({ type: 'user' }));
    if (e3) return next(e3);

    const [e4, serviceList] = await task(Service.find().sort({ created: -1 }).populate("user mechanic"));
    if (e4) return next(e4);

    const [e5, mechanicList] = await task(Account.find({ type: 'mechanic' }).sort({ created: -1 }));
    if (e5) return next(e5);

    const [e6, userList] = await task(Account.find({ type: 'user' }).sort({ created: -1 }));
    if (e6) return next(e6);

    req.rd = { amount: amount[0].totalAmount, service: service, mechanic: mechanic, user: user, serviceList: serviceList, mechanicList: mechanicList, userList: userList };
    return next();
}

router.post("/one", oneLogin);
router.get("/admin", adminData);
module.exports = router;