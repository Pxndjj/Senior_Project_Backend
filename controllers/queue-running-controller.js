const QueueRunning = require("./../models/queue-running");
const getNextSequenceValue =async (run_by,refID)=> {
    const sequenceDocument = await QueueRunning.findOneAndUpdate (
        { run_by: run_by,refID: refID},
        { $inc: { auto_sequence: 1 } },
        { new: true, upsert: true } 
    );
    return sequenceDocument.auto_sequence;
}
const getNextSequenceManyValue= async(run_by,refID,count)=>{
    const sequenceDocument = await QueueRunning.findOneAndUpdate (
        { run_by: run_by,refID: refID},
        { $inc: { auto_sequence: count } },
        { new: true, upsert: true } 
    );
    return sequenceDocument.auto_sequence;
}

module.exports ={getNextSequenceManyValue,getNextSequenceValue}


