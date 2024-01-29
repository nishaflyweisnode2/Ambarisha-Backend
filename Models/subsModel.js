const mongoose = require("mongoose"); 

const subsSchema = mongoose.Schema({
    subs: {
        type: String
    }
})



const subs  = mongoose.model('subs', subsSchema);

module.exports = subs