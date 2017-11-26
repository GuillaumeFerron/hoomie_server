/**
 Created by Guillaume Ferron on the 10/6/2017
 **/

import mongoose from 'mongoose';
import async from 'async';
import phs from 'password-hash-and-salt';
import Temperature from './models/Temperature';
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
db.dropDatabase();

var users=[];
var credential =[];
var rooms=[];
var temps=[];

userCreate("Lisa","MARTINI","1994-05-12")

function userCreate(first_name, family_name, d_birth,cb) {
    var userDetail = {first_name:first_name , last_name: family_name };
    if (d_birth != false) userDetail.date_of_birth = d_birth;
    var user = new User(userDetail);

    user.save(function (err) {
        if (err) {
            return
        }
        var access = credentialCreate("ewilys","moi",false,user._id);
        console.log(access);
        access.save(function (err) {
            if (err) {
                return
            }
            user.access = access;
            user.save();
            credential.push(access)

        }  );

        var room = createRoom(205, temps, 15, user._id);
        console.log(room);
        room.save(function (err) {
            if (err) {
                return
            }
            user.room = room;
            user.save();
            rooms.push(room)
        }  );
        createTemperatures(room);
        //console.log("temps:"+temps);
        users.push(user);
        console.log(user);
    }  );

}

function credentialCreate(login,pwd,admin,user_id) {
    var credentialDetail = {login:login };
    credentialDetail.password = pwd ;
    // Creating hash and salt
    if (pwd != false){ //not working
        phs(pwd).hash(function(error, hash) {
            if(error)
                throw new Error('Something went wrong!');

            // Store hash (incl. algorithm, iterations, and salt)
            credentialDetail.password = hash;
            console.log(credentialDetail.password);

        });
    }

    credentialDetail.admin = admin;
    credentialDetail.user_id = user_id;

    return new Credential(credentialDetail);
}

function createRoom(number, temperatures, temperatureAverage,user_id){
    var roomDetail = {number:number,temperatures:temperatures, temperatureAverage:temperatureAverage,inhabitants:[]};
    roomDetail.inhabitants.push(user_id);
    return new Room(roomDetail);

}

function createTemp(date, temperature,room){
    var tempDetail = {date:date,value: temperature,room:room._id};

    var temp = new Temperature(tempDetail);

    temp.save(function (err) {
        if (err) {
            return
        }
        //console.log('room ' + room);
        temps.push(temp)

    }  );

}


function createTemperatures(room) {
    createTemp("2017-10-16-21-05-37", '10',room);
    createTemp("2017-10-16-21-05-45", '12',room);
    createTemp("2017-10-16-21-06-05", '20',room);
    createTemp("2017-10-16-21-05-55", '16',room);
    createTemp("2017-10-16-21-06-00", '18',room);
    createTemp("2017-10-16-21-05-50", '14',room);
    createTemp("2017-10-17-20-44-55", '32',room);
    createTemp("2017-10-17-21-05-50", '50',room);

}

/*async.series([

        userCreate("Lisa","MARTINI","1994-05-12")
    ],
// optional callback
    function(err, results) {
        if (err) {
            console.log('FINAL ERR: '+err);
        }
        else {
            User.findOne(function(err,users){
                if(err)return console.error(err);
                console.log(users);
                users.populate("access","login",function(err,user){
                    if(err)return console.error(err);
                    console.log(user);});
            });

        }
        //All done, disconnect from database
        db.close();
    });*/
