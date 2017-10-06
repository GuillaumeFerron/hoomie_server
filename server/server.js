/**
 Created by Guillaume Ferron on the 10/1/2017
 **/

import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import router from '../router';

// Connect to MongoDB
mongoose.connect('mongodb://localhost/movies');

// Initialize http server
const app = express();

// Logger that outputs all requests into the console
app.use(morgan('combined'));
// Use v1 as prefix for all API endpoints
app.use('/v1', router);

const server = app.listen(3000, () => {
    const { address, port } = server.address();
    console.log(`Listening at http://${address}:${port}`);
});

/*** MongoDb connection ***/

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://localhost/Hoomie", function(error, db) {
    if (error) throw new error("Error connecting to database");

    console.log("Success in connecting to Hoomie database");
});