
/**
 Created by Guillaume Ferron on the 10/6/2017
 modified by Lisa Martini on the 11/20/2017
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
var temps2=[];
var temps3=[];



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
        room.inhabitants.push(user);
        room.save();
        access.user_id = user;
        access.save();
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
            console.log(credentialDetail.password);

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

function createRoom(number, temperatures,cb){
    var roomDetail = {number:number,temperatures: temperatures};

    var room = new Room(roomDetail);

    room.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Room: ' + room);
        rooms.push(room)
        temperatures.forEach(function(t){
            Temperature.update({'_id':t._id},{'room':room},function(err,numberAffected){
                if(err) return console.error(err);
                // console.log("nb doc modified :"+numberAffected);
            });
        })
        cb(null, room)
    }  );

}

function createTemp(date, temperature,tempArray, cb){
    var tempDetail = {date:date,value: temperature};

    var temp = new Temperature(tempDetail);

    temp.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Temp: ' + temp);
        tempArray.push(temp)
        cb(null, temp)
    }  );

}


function createTemperatures(cb) {
    async.parallel([
            function(callback) {
                createTemp("2017-10-16-21-05-37", '20.10',temps,callback);
            },
            function(callback) {
                createTemp("2017-10-16-23-05-45", '22.65',temps,callback);
            },
            function(callback) {
                createTemp("2017-10-17-08-06-05", '23.45',temps,callback);
            },
            function(callback) {
                createTemp("2017-10-17-15-05-55", '22.50',temps,callback);
            },
            function(callback) {
                createTemp("2017-10-18-21-06-00",'20.59',temps,callback);
            },
            function(callback) {
                createTemp("2017-11-05-04-05-50", '24.11',temps,callback);
            },
            function(callback) {
                createTemp("2017-11-19-20-44-55", '24.60',temps,callback);
            },
            function(callback) {
                createTemp("2017-11-25-12-05-50", '25.78',temps,callback);
            },
        ],
        // optional callback
        cb);
}

function createTemperatures2(cb) {
    async.parallel([
            function(callback) {
                createTemp("2017-10-15-21-05-37", '21.10',temps2,callback);
            },
            function(callback) {
                createTemp("2017-10-16-23-05-45", '20.65',temps2,callback);
            },
            function(callback) {
                createTemp("2017-10-17-08-06-05", '21.45',temps2,callback);
            },
            function(callback) {
                createTemp("2017-11-17-15-05-55", '22.50',temps2,callback);
            },
            function(callback) {
                createTemp("2017-11-18-21-06-00",'19.59',temps2,callback);
            },
            function(callback) {
                createTemp("2017-11-05-04-05-50", '20.11',temps2,callback);
            },
            function(callback) {
                createTemp("2017-12-19-20-44-55", '23.60',temps2,callback);
            },
            function(callback) {
                createTemp("2017-12-25-12-05-50", '20.78',temps2,callback);
            },
        ],
        // optional callback
        cb);
}

function createTemperatures3(cb) {
    async.parallel([
            function(callback) {
                createTemp("2017-10-15-21-05-37", '25.10',callback);
            },
            function(callback) {
                createTemp("2017-10-16-23-05-45", '26.65',callback);
            },
            function(callback) {
                createTemp("2017-10-17-08-06-05", '23.45',callback);
            },
            function(callback) {
                createTemp("2017-11-17-15-05-55", '24.50',callback);
            },
            function(callback) {
                createTemp("2017-11-18-21-06-00",'25.59',callback);
            },
            function(callback) {
                createTemp("2017-11-05-04-05-50", '24.11',callback);
            },
            function(callback) {
                createTemp("2017-12-19-20-44-55", '27.60',callback);
            },
            function(callback) {
                createTemp("2017-12-25-12-05-50", '25.78',callback);
            },
        ],
        // optional callback
        cb);
}


function createRooms(cb){
    async.parallel([
        function(callback){
            createRoom(205, temps, callback);
        },
        function(callback){
            createRoom(204, temps2, callback);
        }

    ]);
}
function createCredentials(cb){
    async.parallel([
        function(callback){
            credentialCreate("ewilys","moi",false,callback);
        },
        function(callback){
            credentialCreate("jojo","sis1",false,callback);
        }

    ]);



}

function createUsers(cb){
    async.parallel([
        function(callback){
            userCreate("Lisa","MARTINI","1994-05-12",rooms[0],credential[0],callback);

        },
        function(callback){
            userCreate("Johanna","MARTINI","1989-10-05",rooms[1],credential[1],callback);
        }

    ]);
}
async.series([
        createTemperatures,
        createTemperatures2,
        //createTemperatures3,
        function(callback) {
            createRooms(callback);
           // createRoom(203,temps3,callback);
        },
        function(callback) {
            createCredentials(callback);
            /*credentialCreate("emma","sis2",false,callback);
            credentialCreate("fefe","guigui",false,callback);
            credentialCreate("gout","matmat",false,callback);*/
        },
        function(callback) {
            createUsers(callback);
           /* userCreate("Emma","MARTINI","2001-04-21",rooms[1],credential[2],callback);
            userCreate("Guillaume","Ferron","1995-08-18",rooms[2],credential[3],callback);
            userCreate("Mathieu","GOUTAY","1995-04-25",rooms[2],credential[4],callback);*/
        }

    ],
// optional callback
    function(err, results) {
        if (err) {
            console.log('FINAL ERR: '+err);
        }
        
        //All done, disconnect from database
        db.close();
    });