'use strict'

async function user(req, res, next) {
    if (req.auth) return next();
    return next(e.noAuth);
}

async function member(req, res, next) {
    if (req.auth && req.auth.type == 'member') return next();
    return next(e.forbidden);
}

async function admin(req, res, next) {
    if (req.auth && req.auth.type == 'admin') return next();
    return next(e.forbidden);
}

async function manager(req, res, next) {
    if (req.auth.type == 'admin' || req.auth.type == 'manager') return next();
    return next(e.forbidden);
}

async function trainer(req, res, next) {
    if (req.auth.type == 'admin' || req.auth.type == 'manager') return next();
    if (req.auth.type == 'trainer') return next();
    return next(e.forbidden);
}

async function staff(req, res, next) {
    if (req.auth && req.auth.type != 'member') return next();
    return next(e.forbidden);
}


// Errors
const e = {
    badReq: new Error('#400 Please send valid details to perform this action.'),
    forbidden: new Error('#401 Your account does not have permission to perform this action.'),
    unpaid: new Error('#402 Please complete your payments to perform this action.'),
    noAuth: new Error('#403 Please login to perform this action.'),
    notFound: new Error('#404 The data you were looking for does not exist.'),
    serverCrashed: new Error('#500 Server could not complete your request. Please contact support.'),
    paymentServerCrashed: new Error('#502 Payment server is sending invlaid reponse. Please contact support.'),
    wrongPass: new Error('#401 The password you entered is incorrect.')
}

module.exports = { e, user, member, admin, manager, trainer, staff };