const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ServiceSchema = new Schema
    ({
        user: { type: Schema.Types.ObjectId, ref: "Account", required: true },
        mechanic: { type: Schema.Types.ObjectId, ref: "Account", required: true },
        vehicle: { type: String, required: true },
        plate: { type: String, required: true },
        description: { type: String, required: true },
        status: { type: String, default: "Requested", enum: ["Requested", "Ongoing", "Completed", "Rejected", "Cancelled"] },
        amount: { type: Number, default: 0 },
        reviewed: { type: Boolean, default: false },
        rating: { type: Number, default: 0 },

        skill: { type: String, default: "two", enum: ["two", "three", "four", "heavy"] },
        archive: { type: Boolean, default: false, index: true },
        created: { type: Date, default: Date.now },
        updated: { type: Date, default: Date.now },
    });


const Model = mongoose.model("Service", ServiceSchema);
module.exports = Model;

/*
Requested => Cancel, Call
Ongoing => Call, Payment
Completed => [Review], New
Rejected => New
Cancelled => New
*/