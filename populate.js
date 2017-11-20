/**
 Created by Guillaume Ferron on the 10/6/2017
 **/

import mongoose from 'mongoose';
import Temperature from './models/temperature';

const temperatures = [
    {
        "_id" : ObjectId("59e60908cab6482c943c8eb4"),
        "date" : "2017-10-16-21-05-37",
        "temperature" : 10,
        "__v" : 0
    },
    {
        "_id" : ObjectId("59e60908cab6482c943c8eb5"),
        "date" : "2017-10-16-21-05-45",
        "temperature" : 12,
        "__v" : 0
    },
    {
        "_id" : ObjectId("59e60908cab6482c943c8eb9"),
        "date" : "2017-10-16-21-06-05",
        "temperature" : 20,
        "__v" : 0
    },
    {
        "_id" : ObjectId("59e60908cab6482c943c8eb7"),
        "date" : "2017-10-16-21-05-55",
        "temperature" : 16,
        "__v" : 0
    },
    {
        "_id" : ObjectId("59e60908cab6482c943c8eb8"),
        "date" : "2017-10-16-21-06-00",
        "temperature" : 18,
        "__v" : 0
    },
    {
        "_id" : ObjectId("59e60908cab6482c943c8eb6"),
        "date" : "2017-10-16-21-05-50",
        "temperature" : 14,
        "__v" : 0
    },
    {
        "_id" : ObjectId("59e7a126c4c67010dba4791d"),
        "date" : "2017-10-17-20-44-55",
        "temperature" : 32,
        "__v" : 0
    },
    {
        "_id" : ObjectId("59e7a249c4c67010dba47978"),
        "date" : "2017-10-17-21-05-50",
        "temperature" : 50,
        "__v" : 0
    }
];
var mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/temperatures';
// Connect to MongoDB
mongoose.connect(mongoDB);

// Go through each movie
temperatures.map(data => {
    // Initialize a model with movie data
    const temperature = new Temperature(data);
    // and save it into the database
    temperature.save();
});
