/**
 Created by Guillaume Ferron on the 10/6/2017
 **/
import Temperature from '../models/Temperature';
import Room from '../models/Room';
import async from 'async';


//GET fonction
//All temperatures
export const allTemperatures = (req, res, next) => {
    Room.findOne({'number':req.params.room},function(err,r){
        if(err) res.json({"error":err});
        Temperature.find({'room':r}, {}).exec((err, temperatures) => res.json(
            { data: temperatures}
        ));

    });

};

//Last Temperature
export const lastTemperature = (req, res, next) => {
    Room.findOne({'number':req.params.room},function(err,r){
        if(err) res.json({"error":err});
        Temperature.find({'room':r}, {}).sort({_id:-1}).limit(1).exec((err, temperatures) => res.json(
            { data: temperatures}
        ));
    });
};

//Temperatures ulterior to a given date
export const periodTemperature = (req, res, next) => {
    Room.findOne({'number':req.params.room},function(err,r) {
        if (err) res.json({"error": err});
        Temperature.find({'room': r}, {}).exec(function (err, temperatures) {
            let sortedTemp = [];
            const period = req.params.date.split("-");

            //Go through all temperatures in db
            for (let i = 0; i < temperatures.length; i++) {
                let curr = temperatures[i].date.split("-");
                let verif = true;
                //Check that the two formats are correct
                if (curr.length === period.length) {
                    //Go through all fields of date
                    for (let j = 0; j < curr.length; j++) {
                        //If the current field is lower than the one given as a url parameter, then it is anterior
                        if (parseInt(curr[j]) < parseInt(period[j])) {
                            verif = false;
                            break;
                        }
                    }
                    if (verif) {
                        sortedTemp.push(temperatures[i]);
                    }
                }
            }
            return res.json({data: sortedTemp}
            )
        });
    });
};

//Specific day temperature
export const dayTemperature = (req, res, next) => {
    const period = req.params.date.split("-");

    Room.findOne({'number':req.params.room},function(err,r) {
        if (err) res.json({"error": err});
        Temperature.find({'room': r}, {}).exec(function (err, temperatures) {
            let sortedTemp = [];
            temperatures.forEach(function(t){
                let curr = t.date.split("-");
                let verif = true;

                //Check that the two formats are correct

                //Go through the first three fields of date, hence the given day
                for (let j = 0; j < 3; j++) {
                    //If the current field is lower than the one given as a url parameter, then it is anterior
                    if (parseInt(curr[j]) !== parseInt(period[j])) {
                        verif = false;
                        break;
                    }
                }
                if (verif) {
                    var data_to_send = {'value':t.value,'date':curr[3]+'-'+curr[4]}; //give the hour and the minutes
                    console.log(data_to_send);
                    sortedTemp.push(data_to_send);
                }
            });

            return res.json({data: sortedTemp}
            )
        });
    });
};

//Specific month temperature
export const monthTemperature = (req, res, next) => {
    const period = req.params.date.split("-");
    Room.findOne({'number':req.params.room},function(err,r) {
        if (err) res.json({"error": err});
        Temperature.find({'room': r}, {}).exec(function (err, temperatures) {
            let goodTemp = new Map();
            let averageTemp = [];
            temperatures.forEach(function(t){
                let curr = t.date.split("-");
                let verif = true;

                //Go through athe first two fields of date, hence the given month
                for (let j = 0; j < 2; j++) {
                    //If the current field is lower than the one given as a url parameter, then it is anterior
                    if (parseInt(curr[j]) !== parseInt(period[j])) {
                        verif = false;
                        break;
                    }
                }
                if (verif) {
                    if(goodTemp.has(curr[2])){
                        var val = goodTemp.get(curr[2]);
                        goodTemp.set(curr[2],val.push(t.value));
                    }else{
                        goodTemp.set(curr[2],[t.value]);
                    }
                }
            });
            console.log(goodTemp);
            goodTemp.forEach(function(v,c,map){
                var av =0.0;
                for(var i=0;i<v.length;i++){
                    av += v[i];
                }
                av = av /v.length;
                averageTemp.push({'date':c,'value':av});
            });
            return res.json({data: averageTemp});
        });
    });
};

//Specific year temperature
export const yearTemperature = (req, res, next) => {
    Room.findOne({'number':req.params.room},function(err,r) {
        if (err) res.json({"error": err});
        Temperature.find({'room': r}, {}).exec(function (err, temperatures) {
            let sortedTemp = [];
            const period = req.params.date.split("-");

            //Go through all temperatures in db
            for (let i = 0; i < temperatures.length; i++) {
                let curr = temperatures[i].date.split("-");
                //Check that the two formats are correct

                if (parseInt(curr[0]) === parseInt(period[0])) {
                    sortedTemp.push(temperatures[i]);
                }

            }
            return res.json({data: sortedTemp}
            )
        });
    });
};

//Average per month for one room
export const averageMonth = (req,res,next) => {
    var room = req.params.room;
    var month = req.params.date;
    if(room == "all"){

    }else{
        res.redirect('http://hoomieserver.herokuapp.com/'+room+'/temperature/month/'+month);
    }
};


//Average per year for one room
export const averageYear = (req,res,next) => {
    var room = req.params.room;
    var year = req.params.date;
    if(room == "all"){

    }else{
        res.redirect('http://hoomieserver.herokuapp.com/'+room+'/temperature/year/'+year);
    }
};

//Post function
//addDoc


export const addTemp = (req,res,next) => {
    //console.log(req.url,req.body.data.length, req.body.data);
    var docs = req.body.data;

    docs.forEach(function(d) {
        Room.findOne({'number': d.room}, function (err, r) {
            if (err) return console.error(err);
            async.series([
                function (callback) {
                    createTemp(d.date, d.value, r, callback);
                }

            ],
            function (err,results) {
                console.log("finish");
                res.end("yes");
            });
        });
    });


};

/*function (callback) {
                   r.populate("temperatures", "value -_id", function (err, room) {
                       var average = 0.0;
                       room.temperatures.forEach(function (t) {
                           //console.log(t.value);
                           average += t.value;
                       });
                       average = average / room.temperatures.length;
                       console.log(average);
                       r.temperatureAverage = average;
                       r.save();
                   });
                   console.log(r);
               },*/

function createTemp(date, temperature,room,cb){
    var tempDetail = {date:date,value: temperature,room:room};

    var temp = new Temperature(tempDetail);

    temp.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Temp: added');
        room.temperatures.push(temp);
        room.save();

        cb(null, temp)
    }  );

}