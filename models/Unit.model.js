const mongoose = require('mongoose');

const Unit = mongoose.Schema({
    _id: String,
    serverTime: String,
    serverDate: String,
    date: String,
    temp1: String,
    temp2: String,
    temp3: String,
    temp4: String,
    temp5: String,
    temp6: String,
    ph1: String,
    ph2: String,
    ph3: String,
    ph4: String,
    ph5: String,
    rh: String,
    energy: String,
    flow: String,
    flowVolume: String,
    historicData : [
        {
            mcId: String,
            serverTime: String,
            serverDate: String,
            date: String,
            temp1: String,
            temp2: String,
            temp3: String,
            temp4: String,
            temp5: String,
            temp6: String,
            ph1: String,
            ph2: String,
            ph3: String,
            ph4: String,
            ph5: String,
            rh: String,
            energy: String,
            flow: String,
            flowVolume: String
        },
    ]
});

module.exports = mongoose.model("unit", Unit);