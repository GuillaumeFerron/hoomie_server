
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
        console.log('New User: ' + user+'\n');
        users.push(user);
       /* room.inhabitants.push(user);
        room.save();
        access.user_id = user;
        access.save();*/
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
            //console.log(credentialDetail.password);

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

function createTemp(date, temperature,tempArray,cb){
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
    var dates = [];
    for(var m=8;m<13;m++){
        if(m<10)m="0"+m;
        for(var d=16;d<25;d++){
            if(d<10)d="0"+d;
            for(var h=10;h<15;h++) {
                if (h < 10) h = "0" + h;
                var val = Math.random() * (26.50 - 20.00) + 20.00;
                    dates.push({m:m,d:d,h:h,val:val});
            }
        }
    }

    async.forEach(dates,function(date,callback){
        createTemp("2017-" + date['m'] + "-" + date['d'] + "-" + date['h'] + "-00-00", date['val'], temps,callback);
    },cb)

}



function createTemperatures2(cb) {
    var dates = [];
    for(var m=8;m<13;m++){
        if(m<10)m="0"+m;
        for(var d=16;d<25;d++){
            if(d<10)d="0"+d;
            for(var h=10;h<15;h++) {
                if (h < 10) h = "0" + h;
                var val = Math.random() * (24.20 - 19.30) + 19.30;
                dates.push({m:m,d:d,h:h,val:val});
            }
        }
    }

    async.forEach(dates,function(date,callback){
        createTemp("2017-" + date['m'] + "-" + date['d'] + "-" + date['h'] + "-00-00", date['val'], temps2,callback);
    },cb);
}

function createTemperatures3(cb) {
    var dates = [];
    for(var m=8;m<13;m++){
        if(m<10)m="0"+m;
        for(var d=16;d<25;d++){
            if(d<10)d="0"+d;
            for(var h=10;h<15;h++) {
                if (h < 10) h = "0" + h;
                var val = Math.random() * (22.80-18.50) + 18.50;
                dates.push({m:m,d:d,h:h,val:val});
            }
        }
    }

    async.forEach(dates,function(date,callback){
        createTemp("2017-" + date['m'] + "-" + date['d'] + "-" + date['h'] + "-00-00", date['val'], temps3,callback);
    },cb)
}



async.series([
        createTemperatures,
        createTemperatures2,
        createTemperatures3,
        function(callback){
            createRoom(205, temps, callback);
        },
        function(callback){
            createRoom(204, temps2, callback);
        },
        function(callback){
            createRoom(203,temps3,callback);
        },
        function(callback){
            credentialCreate("ewilys","moi",false,callback);
        },
        function(callback){
            credentialCreate("jojo","sis1",false,callback);
        },
        function(callback){
            credentialCreate("emma","sis2",false,callback);

        },
        function(callback){
            credentialCreate("fefe","guigui",false,callback);
        },
        function(callback){
            credentialCreate("gout","matmat",false,callback);
        },
        function(callback){
            userCreate("Lisa","MARTINI","1994-05-12",rooms[0],credential[0],callback);
        },
        function(callback){
            userCreate("Johanna","MARTINI","1989-10-05",rooms[1],credential[1],callback);
        },
        function(callback){
            userCreate("Emma","MARTINI","2001-04-21",rooms[1],credential[2],callback);
        },
        function(callback){
            userCreate("Guillaume","Ferron","1995-08-18",rooms[2],credential[3],callback);
        },
        function(callback){
            userCreate("Mathieu","GOUTAY","1995-04-25",rooms[2],credential[4],callback);
        },
        function(callback){
            User.find({},function(err,users){
               users.forEach(function(u){
                  Credential.update({'_id':u.access},{'user_id':u},function(err,nbAff){
                      if(err) return console.error(err);
                  });
                   Room.findOne({'_id':u.room},function(err,r){
                       if(err) return console.error(err);
                       r.inhabitants.push(u);
                       r.save();
                   });
               });
            });
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