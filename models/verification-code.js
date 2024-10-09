const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const models = mongoose.models;

const verificationcodeSchema = new Schema(
    {
        userID: {type: String, required: true},
        generatedCode: {type: String, required: true},
        status: {type: String, required: false},
        lineID: {type: String, required: false},
    },
    {
        timestamps: true,
    }
);

const verificationcode = models.Verificationcode || model("Verificationcode", verificationcodeSchema);
module.exports = verificationcode;
