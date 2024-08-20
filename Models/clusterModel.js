const mongoose = require('mongoose');

const clusterSchema = new mongoose.Schema({
    clusterName: {
        type: String,
    },
    clusterNumber: {
        type: String,
    },
    hubName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hubs",
    },
    dwcCluster: {
        type: String,
    },
    clusterType: {
        type: String,
    },
    loadingTimeStart: {
        type: String,
    },
    loadingTimeOut: {
        type: String,
    },
    recceDistance: {
        type: String,
    }
});

const Cluster = mongoose.model('Cluster', clusterSchema);

module.exports = Cluster;
