/**
 Created by Guillaume Ferron on the 10/6/2017
 **/

import mongoose from 'mongoose';
import async from 'async';
import phs from 'password-hash-and-salt';
import Temperature from './models/temperature';
import Room from './models/Room';
import User from './models/User';
import Credential from './models/Credential';

var mongoDB = process.env.MONGODB_URI || 'mongodb://developer:fefelili@ds117136.mlab.com:17136/hoomie';
// Connect to MongoDB
mongoose.connect(mongoDB,{
    useMongoClient: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users=[];
var credential =[];
var rooms=[];
var temps=[];


function userCreate(first_name, family_name, d_birth,room,access, cb) {
    var userDetail = {first_name:first_name , last_name: family_name };
    if (d_birth != false) userDetail.date_of_birth = d_birth;
    if (room != false) userDetail.room = room;

    if (access!= false) userDetail.access = access;


    var user = new User(userDetail);

    user.save(function (err) {
        if (err) {
            cb(err, null);
            return
        }
        console.log('New User: ' + user);
        users.push(user);
        cb(null, user)
    }  );
}

function credentialCreate(login,pwd,admin, cb) {
    var credentialDetail = {login:login };
    credentialDetail.password = pwd ;
    // Creating hash and salt
    if (pwd != false){ //not working
        phs(pwd).hash(function(error, hash) {
            if(error)
                throw new Error('Something went wrong!');

            // Store hash (incl. algorithm, iterations, and salt)
            credentialDetail.password = hash;
            console.log(hash);

        });
    }

    credentialDetail.admin = admin;

    var credit = new Credential(credentialDetail);

    credit.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New credential: ' + credit);
        credential.push(credit)
        cb(null, credit)
    }  );
}

function createRoom(number, temperatures, temperatureAverage,cb){
    var roomDetail = {number:number,temperature: temperatures, temperatureAverage:temperatureAverage};

    var room = new Room(roomDetail);

    room.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Room: ' + room);
        rooms.push(room)
        cb(null, room)
    }  );

}

function createTemp(date, temperature, cb){
    var tempDetail = {date:date,value: temperature};

    var temp = new Temperature(tempDetail);

    temp.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Temp: ' + temp);
        temps.push(temp)
        cb(null, temp)
    }  );

}


function createTemperatures(cb) {
    async.parallel([
            function(callback) {
                createTemp("2017-10-16-21-05-37", '10',callback);
            },
            function(callback) {
                createTemp("2017-10-16-21-05-45", '12',callback);
            },
            function(callback) {
                createTemp("2017-10-16-21-06-05", '20',callback);
            },
            function(callback) {
                createTemp("2017-10-16-21-05-55", '16',callback);
            },
            function(callback) {
                createTemp("2017-10-16-21-06-00",'18',callback);
            },
            function(callback) {
                createTemp("2017-10-16-21-05-50", '14',callback);
            },
            function(callback) {
                createTemp("2017-10-17-20-44-55", '32',callback);
            },
            function(callback) {
                createTemp("2017-10-17-21-05-50", '50',callback);
            },
        ],
        // optional callback
        cb);
}

async.series([
        createTemperatures,
        function(callback) {
            createRoom(205, temps, 15, callback);
        },
        function(callback) {
            credentialCreate("ewilys","moi",false,callback);
        },
        function(callback) {
            userCreate("Lisa","MARTINI","1994-05-12",rooms[0],credential[0],callback);
        }
    ],
// optional callback
    function(err, results) {
        if (err) {
            console.log('FINAL ERR: '+err);
        }
        else {
            console.log('User: '+users[0]);

        }
        //All done, disconnect from database
       db.close();
    });
