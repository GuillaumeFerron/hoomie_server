
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

Room.findOne({'number':205},function(err,r){
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
});

/*

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


function createAtmospheres(cb) {
    var dates = [];
    for(var m=8;m<13;m++){
        if(m<10)m="0"+m;
        for(var d=16;d<25;d++){
            if(d<10)d="0"+d;
            for(var h=10;h<15;h++) {
                if (h < 10) h = "0" + h;
                var co = Math.random() * (95.00 - 10.00) + 10.00;
                var no2 = Math.random() * (0.45 - 0.01) + 0.01;
                dates.push({m:m,d:d,h:h,co:co,no2:no2});
            }
        }
    }

    async.forEach(dates,function(date,callback){
        createAtmos("2017-" + date['m'] + "-" + date['d'] + "-" + date['h'] + "-00-00", date['co'],date['no2'], 205,atmos,callback);
    },cb)

}



function createAtmospheres2(cb) {
    var dates = [];
    for(var m=8;m<13;m++){
        if(m<10)m="0"+m;
        for(var d=16;d<25;d++){
            if(d<10)d="0"+d;
            for(var h=10;h<15;h++) {
                if (h < 10) h = "0" + h;
                var co = Math.random() * (45.00 - 20.00) + 20.00;
                var no2 = Math.random() * (0.95 - 0.10) + 0.10;
                dates.push({m:m,d:d,h:h,co:co,no2:no2});
            }
        }
    }

    async.forEach(dates,function(date,callback){
        createAtmos("2017-" + date['m'] + "-" + date['d'] + "-" + date['h'] + "-00-00", date['co'],date['no2'], 204,atmos2,callback);
    },cb);
}

function createAtmospheres3(cb) {
    var dates = [];
    for(var m=8;m<13;m++){
        if(m<10)m="0"+m;
        for(var d=16;d<25;d++){
            if(d<10)d="0"+d;
            for(var h=10;h<15;h++) {
                if (h < 10) h = "0" + h;
                var co = Math.random() * (78.50 - 30.00) + 30.00;
                var no2 = Math.random() * (0.63 - 0.15) + 0.15;
                dates.push({m:m,d:d,h:h,co:co,no2:no2});
            }
        }
    }

    async.forEach(dates,function(date,callback){
        createAtmos("2017-" + date['m'] + "-" + date['d'] + "-" + date['h'] + "-00-00", date['co'],date['no2'],203, atmos3,callback);
    },cb)
}



async.series([

        createAtmospheres,
        createAtmospheres2,
        createAtmospheres3,
        function(callback){

            Room.findOne({'number':203},function(err,r){console.log(r.atmospheres);});
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

*/