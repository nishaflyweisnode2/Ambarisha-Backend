const mongoose = require('mongoose');

const contactInformationSchema = new mongoose.Schema({
    phoneCall: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    whatsappChat: {
        type: String,
    },
});

const ContactInformation = mongoose.model('ContactInformation', contactInformationSchema);

module.exports = ContactInformation;
