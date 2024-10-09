const useSendline = require("../models/sendline");

const create = async (obj) => {
    let res = await useSendline.create(obj);
    return res;
}
const update = async (id, obj) => {
    let res = await useSendline.findOneAndUpdate({ _id: id }, { $set: obj }, { new: true });
    return res;
}
const remove = async (id) => {
    const res = await useSendline.findOneAndDelete({ _id: id });
    return res;
}
const findByID = async (id) => {
    const res = await useSendline.findById(id);
    return res;
}
const findAll = async () => {
    const res = await useSendline.find();
    return res;
}
const findByRefID = async (refID) => {
    const res = await useSendline.find({ "refID": refID });
    return res;
}
const findByQueueID = async (queueID) => {
    const res = await useSendline.find({ queueID });
    return res;
}



module.exports = { findByRefID, create, update, remove, findByID, findAll, findByQueueID }


