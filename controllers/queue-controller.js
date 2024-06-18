const moment = require('moment');
moment.locale("en-US");
const Queue = require("../models/queue");
const QueueRunningCtl = require("./queue-running-controller");

const getKeyRunning = (queue_date) => {
    let _hour = Number(moment(queue_date).format("HH"));
    let _date = moment(queue_date);
    _date = _hour <= 4 ? _date.subtract(1, 'days') : _date;
    return moment(_date).format("YYYY-MM-DD");
}
const create = async (obj) => {

    let q_date = moment(obj.time_of_booking).subtract(1, 'months').format("YYYY-MM-DD HH:mm:ss");
    const keyRunning = getKeyRunning(q_date);
    const newId = await QueueRunningCtl.getNextSequenceValue(keyRunning, obj.refID);
    //set queue
    obj.queue_number = newId;
    obj.queue_no = `Q-0${newId}`;
    obj.time_of_booking = moment(obj.time_of_booking).subtract(1, 'months').format("YYYY-MM-DD HH:mm:ss");
    obj.queue_used = 0;
    obj.queue_date = keyRunning;

    console.log(obj.time_of_booking);
    let res = await Queue.create(obj);
    return res;
}
const update = async (obj) => {
    let res = await Queue.findOneAndUpdate({ _id: obj._id }, { $set: obj }, { new: true });
    return res;
}
const nextQueue = async (refID, queue_status) => {
    const isKey = moment(new Date()).format("YYYY-MM-DD");
    const nextqueue = await Queue.find({ "refID": refID, "queue_date": isKey });
    const _nextqueue = nextqueue.filter((o) => o.queue_used == 0)[0];
    if (_nextqueue) {
        _nextqueue.queue_used = 1;
        _nextqueue.queue_status = queue_status;
        await update(_nextqueue);
        return true
    }
    return false;
}
const findByID = async (id) => {
    const res = await Queue.findById(id);
    return res;
}
const findByRefID = async (refID, queue_date) => {
    const res = await Queue.find({ "refID": refID, "queue_date": queue_date });
    return res;
}
const findAllbyRefID = async (refID) => {
    const res = await Queue.find({ "refID": refID });
    return res;
}

module.exports = { create, update, nextQueue, findByID, findByRefID, findAllbyRefID }


