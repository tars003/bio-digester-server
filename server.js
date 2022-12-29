const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const moment = require('moment');
const path = require('path');
const axios = require('axios');
var request = require('requests');

const connectDB = require('./utils/db');

const SerialResponse = require('./models/SerialResponse.model');
const Unit = require('./models/Unit.model');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
require('dotenv').config();


connectDB();


// TEST ROUTE
app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

// GET DATA FROM MICROCOTROLLER
app.post('/serial-data', async (req, res) => {
    try {
        let { 
            mcId, 
            time, 
            date, 
            temp1, 
            temp2, 
            temp3, 
            temp4, 
            temp5,
            temp6,
            ph1, 
            ph2, 
            ph3, 
            ph4, 
            ph5,
            rh,
            energy,
            flow,
            flowVolume
        } = req.body;

        let serObject = req.body;

        serObject['serverDate'] = moment().utcOffset("+05:30").format('DD-MM-YY');
        serObject['serverTime'] = moment().utcOffset("+05:30").format('HH:mm:ss');

        console.log('Serial Reponse : ', serObject);


        const serialRes = await SerialResponse.create(serObject);

        return res.status(200).json({
            success: true,
            data: serialRes
        });

    } catch (err) {
        console.log('error !', err);
        return res.status(503).json({
            success: false,
            error: err
        })
    }
});

// GET DATA FROM MICROCOTROLLER
app.post('/v2/serial-data', async (req, res) => {
    try {
        let { 
            mcId
        } = req.body;

        let serObject = req.body;
        serObject['serverDate'] = moment().utcOffset("+05:30").format('DD-MM-YY');
        serObject['serverTime'] = moment().utcOffset("+05:30").format('HH:mm:ss');
        console.log('Serial Reponse : ', serObject);

        let unitObj = await Unit.findById(mcId);

        if(unitObj) {
            unitObj.set({historicData : [...unitObj.historicData, serObject]});
            unitObj.set(serObject);
            await unitObj.save();

            console.log("updated unit obj");

            return res.status(200).json({
                success: true,
                data: unitObj
            });
        }
        else {
            serObject['_id'] = mcId;
            let newUnit = await Unit.create(serObject);

            return res.status(200).json({
                success: true,
                data: newUnit
            });
        }

        

    } catch (err) {
        console.log('error !', err);
        return res.status(503).json({
            success: false,
            error: err
        })
    }
});

// GET SPECIFIC MICROCONTROLLER'S ALL SERIAL REPONSES
app.get('/get-data/:mcId', async (req, res) => {
    try {
        const srObj = await SerialResponse.find({mcId: `${req.params.mcId}`});
        return res.status(200).json({
            success: true,
            count: srObj.length,
            data: srObj
        });
    } catch (err) {
        console.log('error !', err);
        return res.status(503).json({
            success: false,
            error: err
        })
    }
});

// GET SPECIFIC MICROCONTROLLER'S ALL SERIAL REPONSES
app.get('/v2/get-data/:mcId', async (req, res) => {
    try {
        const srObj = await Unit.findById(req.params.mcId);
        return res.status(200).json({
            success: true,
            count: srObj.historicData.length,
            data: srObj.historicData
        });
    } catch (err) {
        console.log('error !', err);
        return res.status(503).json({
            success: false,
            error: err
        })
    }
});

// GET LATEST MICROCONTROLLER SERIAL REPONSES
app.get('/get-latest/:mcId', async (req, res) => {
    try {
        const srObj = await SerialResponse.find({mcId: `${req.params.mcId}`}).sort({ _id: -1 }).limit(1);
        return res.status(200).json({
            success: true,
            count: srObj.length,
            data: srObj
        });
    } catch (err) {
        console.log('error !', err);
        return res.status(503).json({
            success: false,
            error: err
        })
    }
});

// GET LATEST MICROCONTROLLER SERIAL REPONSES
app.get('/v2/get-latest/:mcId', async (req, res) => {
    try {
        const srObj = await Unit.findById(req.params.mcId);
        const len = srObj.historicData.length;
        delete srObj.historicData;
        return res.status(200).json({
            success: true,
            length: len,
            data: srObj
        });
    } catch (err) {
        console.log('error !', err);
        return res.status(503).json({
            success: false,
            error: err
        })
    }
});

server.listen(process.env.PORT || 3000, () => {
    let port = process.env.PORT || 3000;
    console.log(`listening on localhost:${port}`);
});
