
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
/*
Room.findOne({'number':203},function(err,r){
    if(err)return console.log(err);
    Temperature.find({'room':r},function(err,temps){
        if(err)return console.log(err);
        temps.forEach(function(t){
            let curr = t.date.split('-');

            if(parseInt(curr[0])==2018 && curr[1] == '01' && (curr[2]=='4' || curr[2] == '6' || curr[2]=='8' || curr[2]=='9')  ){
                console.log(t._id);
                var ind = r.temperatures.indexOf(t);
                r.temperatures.splice(ind,1);
                r.save();
                t.remove();
                console.log("ok remove");
            }
        })
    });

});
*/

var rooms=[];
var temps=[];//203
var temps2=[];//205
var atmos=[];//203
var atmos2=[];//205

function createTemp(date, temperature,room, tempArray,cb){
    Room.findOne({'number': room}, function (err, r) {
        if (err) return console.error(err);
        var tempDetail = {date: date, value: temperature,room:r};

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
    var days =[{'d':'22','h':[9,10,11,14,15,16]}
        /*{'d':'04','h':[16]},{'d':'06','h':[13]},{'d':'08','h':[9,10,11,15,16,17]},{'d':'09','h':[9,10,11,13,14,15]},{'d':10,'h':[10,23]},{'d':11,'h':[8,9]},{'d':18,'h':[10,11,16]}*/]

    var dates =[]
    for(var l=0;l<days.length;l++){
        var day = days[l];
        for(var hours=0;hours<day['h'].length;hours++){
            var h = day['h'][hours];
            if (h < 10) h = "0" + h;
            var val = Math.random() * (24.50 - 13.00) + 13.00;
            dates.push({d:day['d'],h:h,val:val});
        }
    }
    async.forEach(dates,function(date,callback){
        createTemp("2018-01" + "-" + date['d'] + "-" + date['h'] + "-00-00",date['val'], 203,temps,callback);
    },cb);


}



function createTemperatures2(cb) {
    var days =[{'d':'22','h':[9,10,11,14,15,16]}
        /*{'d':'04','h':[16]},{'d':'06','h':[13]},{'d':'08','h':[9,10,11,15,16,17]},{'d':'09','h':[9,10,11,13,14,15]},{'d':10,'h':[10,23]},{'d':11,'h':[8,9]},{'d':18,'h':[10,11,16]}*/]
    var dates =[]
    for(var l=0;l<days.length;l++){
        var day = days[l];
        for(var hours=0;hours<day['h'].length;hours++){
            var h = day['h'][hours];
            if (h < 10) h = "0" + h;
            var val = Math.random() * (22.80-18.50) + 18.50;
            dates.push({d:day['d'],h:h,val:val});
        }
    }
    async.forEach(dates,function(date,callback){
        createTemp("2018-01" + "-" + date['d'] + "-" + date['h'] + "-00-00",date['val'], 205,temps2,callback);
    },cb);


}


function createAtmospheres(cb) {
    var days =[{'d':'22','h':[9,10,11,14,15,16]}
        /*{'d':'04','h':[16]},{'d':'06','h':[13]},{'d':'08','h':[9,10,11,15,16,17]},{'d':'09','h':[9,10,11,13,14,15]},{'d':10,'h':[10,23]},{'d':11,'h':[8,9]},{'d':18,'h':[10,11,16]}*/]

    var dates =[]
    for(var l=0;l<days.length;l++){
        var day = days[l];
        for(var hours=0;hours<day['h'].length;hours++){
            var h = day['h'][hours];
            if (h < 10) h = "0" + h;
            var co = Math.random() * (95.00 - 10.00) + 10.00;
            var no2 = Math.random() * (0.45 - 0.01) + 0.01;
            createAtmos
            dates.push({d:day['d'],h:h,co:co,no2:no2});
        }
    }
    async.forEach(dates,function(date,callback){
        createAtmos("2018-01" + "-" + date['d'] + "-" + date['h'] + "-00-00", date['co'],date['no2'], 203,atmos,callback);
    },cb);



}



function createAtmospheres2(cb) {
    var days =[{'d':'22','h':[9,10,11,14,15,16]}
        /*{'d':'04','h':[16]},{'d':'06','h':[13]},{'d':'08','h':[9,10,11,15,16,17]},{'d':'09','h':[9,10,11,13,14,15]},{'d':10,'h':[10,23]},{'d':11,'h':[8,9]},{'d':18,'h':[10,11,16]}*/]

    var dates =[]
    for(var l=0;l<days.length;l++){
        var day = days[l];
        for(var hours=0;hours<day['h'].length;hours++){
            var h = day['h'][hours];
            if (h < 10) h = "0" + h;
            var co = Math.random() * (45.00 - 20.00) + 20.00;
            var no2 = Math.random() * (0.95 - 0.10) + 0.10;
            createAtmos
            dates.push({d:day['d'],h:h,co:co,no2:no2});
        }
    }
    async.forEach(dates,function(date,callback){
        createAtmos("2018-01" + "-" + date['d'] + "-" + date['h'] + "-00-00", date['co'],date['no2'], 205,atmos2,callback);
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

