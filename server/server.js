/**
 Created by Guillaume Ferron on the 10/1/2017
 **/

import express from 'express';
import mongodb from 'mongodb';

/*** HTTP server initialization ***/

// Initialize http server
const app = express();

// Handle / route
app.get('/', (req, res) =>
res.send('Hello World!')
);

// Launch the server on port 3000
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