/**
 Created by Guillaume Ferron on the 10/6/2017
 Modified by Lisa Martini since  nov 2017
 **/
import Temperature from '../models/Temperature';
import Room from '../models/Room';
import async from 'async';


//GET fonction
//All temperatures
export const allTemperatures = (req, res, next) => {
   try{
       Room.findOne({'number':req.params.room},function(err,r){
           if(err) res.json({"error":err});
           Temperature.find({'room':r}, {}).exec((err, temperatures) => res.json(
               { data: temperatures}
           ));

       });
   }catch(err){
       console.log("Issue on params"+err);
       res.status(404);
       res.send("Wrong params");
   }
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
/*warning not refactor */
export const periodTemperature = (req, res, next) => {
    try{
        if(isNaN(parseInt(req.params.room))){
            console.log("Issue on room : it's not a number");
            res.status(404);
            return res.send("Wrong room");
        }
    }catch(err){
        console.log(("Issue on params"));
        res.status(404);
        return res.send("issue on params");
    }
    Room.findOne({'number':req.params.room},function(err,r) {
        if (err) res.json({"error": err});
        Temperature.find({'room': r}, {}).exec(function (err, temperatures) {
            let sortedTemp = [];
            try{
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
                return res.json({data: sortedTemp})
            }catch(err){
                console.log("Issue on params"+err);
                res.status(404);
                return res.send("Wrong params");
            }

        });
    });
};

//Specific day temperature
export const dayTemperature = (req, res, next) => {
    try{
        const period = req.params.date.split("-");
        if(isNaN(parseInt(req.params.room))){
            console.log("Issue on room : it's not a number");
            res.status(404);
            return res.send("Wrong room");
        }
        period.forEach(function (d){
            if(isNaN(parseInt(d))){
                console.log("Issue on year : it's not a number");
                res.status(404);
                return res.send("Wrong date");
            }
        });

        Room.findOne({'number':req.params.room},function(err,r) {
            if (err) return res.json({"error": err});
            Temperature.find({'room': r}, {}).exec(function (err, temperatures) {
                if (err) console.log("error"+ err);
                var averageTemp = computeAverage(temperatures,3,period);
                return res.json({data: averageTemp}
                )
            });
        });

    }catch(err){
        console.log("Issue on params"+err);
        res.status(404);
        res.send("Wrong params");
    }


};

//Specific month temperature
export const monthTemperature = (req, res, next) => {
    try{
        const period = req.params.date.split("-");
        if(isNaN(parseInt(req.params.room))){
            console.log("Issue on room : it's not a number");
            res.status(404);
            return res.send("Wrong room");
        }
        period.forEach(function (d){
            if(isNaN(parseInt(d))){
                console.log("Issue on year : it's not a number");
                res.status(404);
                return res.send("Wrong date");
            }
        });

        Room.findOne({'number':req.params.room},function(err,r) {
            if (err) return res.json({"error": err});
            Temperature.find({'room': r}, {}).exec(function (err, temperatures) {
                if (err) console.log("error"+ err);
                var averageTemp = computeAverage(temperatures,2,period);
                return res.json({data: averageTemp});
            });
        });

    }catch(err){
        console.log("Issue on params"+err);
        res.status(404);
        res.send("Wrong params");
    }


};

//Specific year temperature
export const yearTemperature = (req, res, next) => {
    try {
        const period = req.params.date.split("-");
        if (isNaN(parseInt(req.params.room))) {
            console.log("Issue on room : it's not a number");
            res.status(404);
            return res.send("Wrong room");
        }
        period.forEach(function (d) {
            if (isNaN(parseInt(d))) {
                console.log("Issue on year : it's not a number");
                res.status(404);
                return res.send("Wrong date");
            }
        });

        Room.findOne({'number': req.params.room}, function (err, r) {
            if (err) return res.json({"error": err});
            Temperature.find({'room': r}, {}).exec(function (err, temperatures) {
                if (err) console.log("error"+ err);
                var averageTemp = computeAverage(temperatures, 1, period);
                return res.json({data: averageTemp});
            });
        });
    }catch(err){
        console.log("Issue on params"+err);
        res.status(404);
        res.send("Wrong params");
    }
};

function computeAverage(temperatures,date,period ){
    let goodTemp = new Map();

    console.log(temperatures);
    temperatures.forEach(function(t){
        console.log(t);
        let curr;
        try{
            curr = t.date.split("-");
            let verif = true;

            //Go through athe first two fields of date, hence the given month
            for (let j = 0; j < date; j++) {
                //If the current field is lower than the one given as a url parameter, then it is anterior
                if (parseInt(curr[j]) !== parseInt(period[j])) {
                    verif = false;
                    break;
                }
            }
            if (verif) {
                if(goodTemp.has(curr[date])){
                    var val = goodTemp.get(curr[date]);
                    val.push(t.value);
                    goodTemp.set(curr[date],val);
                }else{
                    goodTemp.set(curr[date],[t.value]);
                }
            }
        }
        catch(err){
            console.log("Caught error : "+err);
        }


    });

    return  computeMapAverage(goodTemp) ;
}

function computeMapAverage(map){
    var result =[];
    console.log("map",map)
    map.forEach(function(v,c,m){
        var av =0.0;
        for(var i=0;i<v.length;i++){
            av += v[i];
        }
        av = av /v.length;
        result.push({'date':c,'value':av});
    });
    console.log(result);
    return result;
}

//Average per month for one room
export const averageDay = (req,res,next) => {
    try{
        var room = req.params.room;
        var day = req.params.date.split("-");
        day.forEach(function (d){
            if(isNaN(parseInt(d))){
                console.log("Issue on date : it's not a number");
                res.status(404);
                return res.send("Wrong date");
            }
        });
    }
    catch(err){
        console.log("Issue on params"+err);
        res.status(404);
        return res.send("Wrong params");
    }
    if(room == "all"){
        Temperature.find({}, {}).exec(function (err, temperatures) {
            if(err) return console.log(err);
            var averageTemp = computeAverage(temperatures,3,day);
            res.json({data:averageTemp});
        });
    }else if (!isNaN(parseInt(room))){
        res.redirect('http://hoomieserver.herokuapp.com/'+room+'/temperature/day/'+req.params.date);
    }else{
        res.status(404);
        res.send("Wrong room param");
    }
};


//Average per month for one room
export const averageMonth = (req,res,next) => {
    try{
        var room = req.params.room;
        var month = req.params.date.split("-");
        month.forEach(function (m){
            if(isNaN(parseInt(m))){
                console.log("Issue on date : it's not a number");
                res.status(404);
                return res.send("Wrong date");

            }
        });
    }
    catch(err){
        console.log("Issue on params"+err);
        res.status(404);
        return res.send("Wrong params");

    }
    if(room == "all"){
        Temperature.find({}, {}).exec(function (err, temperatures) {
            if(err) return console.log(err);
            var averageTemp = computeAverage(temperatures,2,month);
            res.json({data:averageTemp});
        });
    }else if (!isNaN(parseInt(room))){
        res.redirect('http://hoomieserver.herokuapp.com/'+room+'/temperature/month/'+req.params.date);
    }else{
        res.status(404);
        res.send("Wrong room param");
    }

};


//Average per year for one room
export const averageYear = (req,res,next) => {
    try{
        var room = req.params.room;
        var year = req.params.date.split("-");
        if(isNaN(parseInt(year))){
            console.log("Issue on year : it's not a number");
            res.status(404);
            return res.send("Wrong date");

        }
    }
   catch(err){
        console.log("Issue on params"+err);
        res.status(404);
        return res.send("Wrong params");


   }

    if(room == "all"){
        Temperature.find({}, {}).exec(function (err, temperatures) {
            if(err) return console.log(err);
            var averageTemp = computeAverage(temperatures,1,year);
            res.json({data:averageTemp});
        });

    }else if(!isNaN(parseInt(room))){
        res.redirect('http://hoomieserver.herokuapp.com/'+room+'/temperature/year/'+year);
    }else{
        res.status(404);
        res.send("Wrong room param");
    }

};

//Post function
//addDoc


export const addTemp = (req,res,next) => {
    try{
        console.log(req.url,req.body);
        var docs = req.body.data;

        //add check on room number time and val
        docs.forEach(function(d) {
            Room.findOne({'number': d.room}, function (err, r) {
                if (err){
                    res.end();
                    return console.log(err);

                }
                async.series([
                        function (callback) {

                            var t = parseFloat(d.value);
                            if(!isNaN(t)){
                                if(d.date.match(/\d{4}((-)\d{2}){5}/))
                                    createTemp(d.date,d.value, r, callback);
                            }

                        }

                    ],
                    function (err,results) {
                        console.log("finish");
                        res.end("yes");
                    });
            });
        });
    }
   catch(err){
        console.log("Caught exception while adding doc :"+err);
        return res.end("no");
   }


};



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