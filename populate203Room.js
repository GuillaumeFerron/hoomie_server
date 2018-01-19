
/**
 Created by  Lisa Martini on the 01/19/2018
 **/

import mongoose from 'mongoose';
import async from 'async';
import Room from './models/Room';
import Atmosphere from './models/Atmosphere';
import Temperature from './models/Temperature';

var mongoDB = process.env.MONGODB_URI || 'mongodb://developer:fefelili@ds117136.mlab.com:17136/hoomie';
// Connect to MongoDB
mongoose.connect(mongoDB,{
    useMongoClient: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/*Room.findOne({'number':205},function(err,r){
    if(err)return console.log(err);
    Temperature.find({'room':r},function(err,temps){
        if(err)return console.log(err);
        temps.forEach(function(t){
            let curr = t.date.split('-');

            if(parseInt(curr[0])==2017 && parseInt(curr[1]) == 12 && parseInt(curr[2]) == 14){
                console.log(t._id);
                var ind = r.temperatures.indexOf(t);
                r.temperatures.splice(ind,1);
                r.save();
                t.remove();
                console.log("ok remove");
            }
        })
    });
});*/

var rooms=[];
var temps=[];//203
var temps2=[];//205
var atmos=[];//203
var atmos2=[];//205

function createTemp(date, temperature,room, tempArray,cb){
    Room.findOne({'number': room}, function (err, r) {
        if (err) return console.error(err);
        var tempDetail = {date: date, value: temperature};

        var temp = new Temperature(tempDetail);

        temp.save(function (err) {
            if (err) {
                cb(err, null)
                return
            }
            console.log('New Temp: ' + temp);
            tempArray.push(temp);
            r.temperatures.push(temp);
            r.save();
            cb(null, temp)
        });
    });

}




function createAtmos(date, co, no2,room,atmosArray,cb){
    Room.findOne({'number': room}, function (err, r) {
        if (err) return console.error(err);
        var atmosDetail = {date:date,co:co,no2:no2,room:r};

        var atmos = new Atmosphere(atmosDetail);

        atmos.save(function (err) {
            if (err) {
                cb(err, null)
                return
            }
            console.log('New Atmos: ' + atmos);
            atmosArray.push(atmos);
            r.atmospheres.push(atmos);
            r.save();
            cb(null, atmos)
        }  );

    });
}

function createTemperatures(cb) {
    var days =[{'d':4,'h':[16]},{'d':6,'h':[13]},{'d':8,'h':[9,10,11,15,16,17]},{'d':9,'h':[9,10,11,13,14,15]},{'d':10,'h':[10,23]},{'d':11,'h':[8,9]},{'d':18,'h':[10,11,16]}]

    async.forEach(days,function(day,callback){
        for(var hours=0;hours<day['h'].length;hours++){
            var val = Math.random() * (26.50 - 20.00) + 20.00;
            createTemp("2018-01" + "-" + day['d'] + "-" + day['h'][hours] + "-00-00",val, 203,temps,callback);
        }
    },cb);


}



function createTemperatures2(cb) {
    var days =[{'d':4,'h':[16]},{'d':6,'h':[13]},{'d':8,'h':[9,10,11,15,16,17]},{'d':9,'h':[9,10,11,13,14,15]},{'d':10,'h':[10,23]},{'d':11,'h':[8,9]},{'d':18,'h':[10,11,16]}]

    async.forEach(days,function(day,callback){
        for(var hours=0;hours<day['h'].length;hours++){
            var val = Math.random() * (22.80-18.50) + 18.50;
            createTemp("2018-01" + "-" + day['d'] + "-" + day['h'][hours] + "-00-00", val, 205,temps2,callback);
        }
    },cb);

}


function createAtmospheres(cb) {
    var days =[{'d':4,'h':[16]},{'d':6,'h':[13]},{'d':8,'h':[9,10,11,15,16,17]},{'d':9,'h':[9,10,11,13,14,15]},{'d':10,'h':[10,23]},{'d':11,'h':[8,9]},{'d':18,'h':[10,11,16]}]

    async.forEach(days,function(day,callback){
        for(var hours=0;hours<day['h'].length;hours++){
            var co = Math.random() * (95.00 - 10.00) + 10.00;
            var no2 = Math.random() * (0.45 - 0.01) + 0.01;
            createAtmos("2018-01" + "-" + day['d'] + "-" + day['h'][hours] + "-00-00", co,no2, 203,atmos,callback);
        }
    },cb);


}



function createAtmospheres2(cb) {
    var days =[{'d':4,'h':[16]},{'d':6,'h':[13]},{'d':8,'h':[9,10,11,15,16,17]},{'d':9,'h':[9,10,11,13,14,15]},{'d':10,'h':[10,23]},{'d':11,'h':[8,9]},{'d':18,'h':[10,11,16]}]

    async.forEach(days,function(day,callback){
        for(var hours=0;hours<day['h'].length;hours++){
            var co = Math.random() * (45.00 - 20.00) + 20.00;
            var no2 = Math.random() * (0.95 - 0.10) + 0.10;
            createAtmos("2018-01" + "-" + day['d'] + "-" + day['h'][hours] + "-00-00", co,no2, 205,atmos2,callback);
        }
    },cb);

}



async.series([
        createTemperatures,
        createTemperatures2,
        createAtmospheres,
        createAtmospheres2,
        function(callback){

            Room.findOne({'number':203},function(err,r){console.log(r.temperatures);});
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

