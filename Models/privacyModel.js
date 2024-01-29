const mongoose = require("mongoose"); 

const privacySchema = mongoose.Schema({
    privacy: {
        type: String
    }
})



const privacy  = mongoose.model('privacy', privacySchema);

module.exports = privacy