const Verification = require('../models/verification-code');
const moment = require('moment');
moment.locale("en-US");

const create = async (obj) => {
    let res = await Verification.create(obj);
    return res;
};

const update = async (obj) => {
    let res = await Verification.findOneAndUpdate({ _id: obj.id }, { $set: obj }, { new: true });
    return res;
};

const remove = async (id) => {
    const res = await Verification.findOneAndDelete({ _id: id });
    return res;
};

const findByID = async (id) => {
    const res = await Verification.findById(id);
    return res;
};

const findAll = async () => {
    const res = await Verification.find();
    return res;
};

const findByUserID = async (userID) => {
    const res = await Verification.findOne({ userID });
    return res;
};

const findBylineID = async (lineID) => {
    const res = await Verification.findOne({ lineID });
    return res;
};

module.exports = {
    create,
    update,
    remove,
    findByID,
    findAll,
    findByUserID,
    findBylineID
};
