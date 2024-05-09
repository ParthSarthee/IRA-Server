const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const AccountSchema = new Schema
    ({
        phone: { type: String, required: true, unique: true, index: true },
        pass: { type: String, required: true, select: false },
        type: { type: String, default: "user", enum: ["user", "admin", "mechanic"] },
        name: { type: String },

        //Mechanic Specific
        skill: { type: String },
        location: { type: String },
        amount: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        service: { type: Number, default: 0 },

        archive: { type: Boolean, default: false, index: true },
        created: { type: Date, default: Date.now },
        updated: { type: Date, default: Date.now },
    });


const Model = mongoose.model("Account", AccountSchema);
module.exports = Model;