const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const models = mongoose.models;

const gallerySchema = new Schema(
    {
        refID: { type: String },
        fileName: { type: String }
    },
    {
        timestamps: true,
    }
);
const Uploadfile = models.Uploadfile || model("Uploadfile", gallerySchema);
module.exports = Uploadfile;

