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

        console.log('Serial Reponse : ', req.body);


        const serialRes = await SerialResponse.create(req.body);

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

// GET LATEST MICROCONTROLLER SERIAL REPONSES
app.get('/get-latest/:mcId', async (req, res) => {
    try {
        const srObj = await SerialResponse.find({mcId: `${req.params.mcId}`}).sort({ _id: 1 }).limit(3);
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

server.listen(process.env.PORT || 3000, () => {
    let port = process.env.PORT || 3000;
    console.log(`listening on localhost:${port}`);
});
