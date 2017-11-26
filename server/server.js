/**
 Created by Guillaume Ferron on the 10/1/2017
 **/

import User from '../models/User';
import Credential from '../models/Credential';
import morgan from 'morgan';
import mongoose from 'mongoose';
import express from 'express';

import router from '../router';
import compression from 'compression';
import helmet from 'helmet';

var mongoDB = process.env.MONGODB_URI || 'mongodb://developer:fefelili@ds117136.mlab.com:17136/hoomie';
// Connect to MongoDB
mongoose.connect(mongoDB,{
    useMongoClient: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/*User.findOne(function(err,users){
    if(err)return console.error(err);
    console.log(users);
    users.populate("access","login",function(err,user){
        if(err)return console.error(err);
        console.log(user);});
});*/

// Initialize http server
const app = express();

//helmet is a middleware helping the website to be protected against well-known web-vulnerabilities
app.use(helmet());
// Logger that outputs all requests into the console
app.use(morgan('combined'));
//compression middleware allowing to compression http response to client -need to be add before any route
app.use(compression());
// Use v1 as prefix for all API endpoints
app.use('/', router);

const server = app.listen(8080, () => {
    const { address, port } = server.address();
    console.log(`Listening at http://${address}:${port}`);
});