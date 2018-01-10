/**
 Created by Lisa Martini on the  01/09/2018
 **/
import Atmosphere from '../models/Atmosphere';
import Room from '../models/Room';
import async from 'async';



//GET fonction
//All atmospheres
export const allAtmospheres = (req, res, next) => {
    try{
        Room.findOne({'number':req.params.room},function(err,r){
            if(err) res.json({"error":err});
            Atmosphere.find({'room':r}, {}).exec((err, atmospheres) => res.json(
                { data: atmospheres}
            ));

        });
    }catch(err){
        console.log("Issue on params"+err);
        res.status(404);
        res.send("Wrong params");
    }
};

//Last Atmosphere
export const lastAtmosphere = (req, res, next) => {
    Room.findOne({'number':req.params.room},function(err,r){
        if(err) res.json({"error":err});
        Atmosphere.find({'room':r}, {}).sort({_id:-1}).limit(1).exec((err, atmospheres) => res.json(
            { data: atmospheres}
        ));
    });
};

//Atmospheres ulterior to a given date
/*warning not refactor */
export const periodAtmosphere = (req, res, next) => {
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
        Atmosphere.find({'room': r}, {}).exec(function (err, atmospheres) {
            let sortedAtmos = [];
            try{
                const period = req.params.date.split("-");

                //Go through all atmospheres in db
                for (let i = 0; i < atmospheres.length; i++) {
                    let curr = atmospheres[i].date.split("-");
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
                            sortedAtmos.push(atmospheres[i]);
                        }
                    }
                }
                return res.json({data: sortedAtmos})
            }catch(err){
                console.log("Issue on params"+err);
                res.status(404);
                return res.send("Wrong params");
            }

        });
    });
};

//Specific day atmosphere
export const dayAtmosphere = (req, res, next) => {
    try{
        const period = req.params.date.split("-");
        if(isNaN(parseInt(req.params.room))){
            console.log("Issue on room : it's not a number");
            res.status(404);
            return res.send("Wrong room");
        }
        async.each(period,function (d,callback){
            if(isNaN(parseInt(d))){
                res.status(404);
                res.send("Wrong date");
                console.log("Issue on date : it's not a number");
                return;
            }
            callback();
        },function(err) {

            Room.findOne({'number': req.params.room}, function (err, r) {
                if (err) return res.json({"error": err});
                Atmosphere.find({'room': r}, {}).exec(function (err, atmospheres) {
                    if (err) console.log("error" + err);
                    var averageAtmos = computeAverage(atmospheres, 3, period);
                    return res.json({data: averageAtmos}
                    )
                });
            });
        });
    }catch(err){
        console.log("Issue on params"+err);
        res.status(404);
        res.send("Wrong params");
    }


};

//Specific month atmosphere
export const monthAtmosphere = (req, res, next) => {
    try{
        const period = req.params.date.split("-");
        if(isNaN(parseInt(req.params.room))){
            console.log("Issue on room : it's not a number");
            res.status(404);
            return res.send("Wrong room");
        }
        async.each(period,function (d,callback){
            if(isNaN(parseInt(d))){
                res.status(404);
                res.send("Wrong date");
                console.log("Issue on date : it's not a number");
                return;
            }
            callback();
        },function(err) {

            Room.findOne({'number': req.params.room}, function (err, r) {
                if (err) return res.json({"error": err});
                Atmosphere.find({'room': r}, {}).exec(function (err, atmospheres) {
                    if (err) console.log("error" + err);
                    var averageAtmos = computeAverage(atmospheres, 2, period);
                    return res.json({data: averageAtmos});
                });
            });
        });
    }catch(err){
        console.log("Issue on params"+err);
        res.status(404);
        res.send("Wrong params");
    }


};

//Specific year atmosphere
export const yearAtmosphere = (req, res, next) => {
    try {
        const period = req.params.date.split("-");
        if (isNaN(parseInt(req.params.room))) {
            console.log("Issue on room : it's not a number");
            res.status(404);
            return res.send("Wrong room");
        }
        async.each(period,function (d,callback){
            if(isNaN(parseInt(d))){
                res.status(404);
                res.send("Wrong date");
                console.log("Issue on date : it's not a number");
                return;
            }
            callback();
        },function(err) {

            Room.findOne({'number': req.params.room}, function (err, r) {
                if (err) return res.json({"error": err});
                Atmosphere.find({'room': r}, {}).exec(function (err, atmospheres) {
                    if (err) console.log("error" + err);
                    var averageAtmos = computeAverage(atmospheres, 1, period);
                    return res.json({data: averageAtmos});
                });
            });
        });
    }catch(err){
        console.log("Issue on params"+err);
        res.status(404);
        res.send("Wrong params");
    }
};

function computeAverage(atmospheres,date,period ){
    let goodAtmos = new Map();

    //console.log(atmospheres);
    atmospheres.forEach(function(a){
        //console.log(t);
        let curr;
        try{
            curr = a.date.split("-");
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
                if(goodAtmos.has(curr[date])){
                    var val = goodAtmos.get(curr[date]);
                    val[0].push(a.co);
                    val[1].push(a.no2);
                    goodAtmos.set(curr[date],val);
                }else{
                    goodAtmos.set(curr[date],[[a.co],[a.no2]]);
                }

            }
        }
        catch(err){
            console.log("Caught error : "+err);
        }


    });

    return  computeMapAverage(goodAtmos) ;
}

function computeMapAverage(map){
    var result =[];
    console.log("map",map)
    map.forEach(function(v,c,m){
        var av = 0.0;
        var av2 = 0.0;
        for(var i=0;i<v[0].length;i++){
            av += v[0][i];
            av2 += v[1][i];
        }
        av = av /v[0].length;
        av2 = av2/v[1].length;
        result.push({'date':c,'co':av,'no2':av2});
    });
    console.log(result);
    return result;
}

//Average per month for one room
export const averageDay = (req,res,next) => {
    try{
        var room = req.params.room;
        var day = req.params.date.split("-");
        async.each(day,function (d,callback){
                if(isNaN(parseInt(d))){
                    res.status(404);
                    res.send("Wrong date");
                    console.log("Issue on date : it's not a number");
                    return;
                }
                callback();
            },function(err){
                if(room == "all"){
                    Atmosphere.find({}, {}).exec(function (err, atmospheres) {
                        if(err) return console.log(err);
                        var averageAtmos = computeAverage(atmospheres,3,day);
                        res.json({data:averageAtmos});
                    });
                }else if (!isNaN(parseInt(room))){
                    res.redirect('http://hoomieserver.herokuapp.com/'+room+'/atmosphere/day/'+req.params.date);
                }else{
                    res.status(404);
                    res.send("Wrong room param");
                }
            }
        );

    }
    catch(err){
        console.log("Issue on params"+err);
        res.status(404);
        return res.send("Wrong params");
    }


};


//Average per month for one room
export const averageMonth = (req,res,next) => {
    try{
        var room = req.params.room;
        var month = req.params.date.split("-");
        async.each(month,function (d,callback){
            if(isNaN(parseInt(d))){
                res.status(404);
                res.send("Wrong date");
                console.log("Issue on date : it's not a number");
                return;
            }
            callback();
        },function(err){
            if(room == "all"){
                Atmosphere.find({}, {}).exec(function (err, atmospheres) {
                    if(err) return console.log(err);
                    var averageAtmos = computeAverage(atmospheres,2,month);
                    res.json({data:averageAtmos});
                });
            }else if (!isNaN(parseInt(room))){
                res.redirect('http://hoomieserver.herokuapp.com/'+room+'/atmosphere/month/'+req.params.date);
            }else{
                res.status(404);
                res.send("Wrong room param");
            }
        });
    }
    catch(err){
        console.log("Issue on params"+err);
        res.status(404);
        return res.send("Wrong params");

    }


};


//Average per year for one room
export const averageYear = (req,res,next) => {
    try{
        var room = req.params.room;
        var year = req.params.date.split("-");
        async.each(year,function (d,callback){
            if(isNaN(parseInt(d))){
                res.status(404);
                res.send("Wrong date");
                console.log("Issue on date : it's not a number");
                return;
            }
            callback();
        },function(err){
            if(room == "all"){
                Atmosphere.find({}, {}).exec(function (err, atmospheres) {
                    if(err) return console.log(err);
                    var averageAtmos = computeAverage(atmospheres,1,year);
                    res.json({data:averageAtmos});
                });

            }else if(!isNaN(parseInt(room))){
                res.redirect('http://hoomieserver.herokuapp.com/'+room+'/atmosphere/year/'+year);
            }else{
                res.status(404);
                res.send("Wrong room param");
            }
        });
    }
    catch(err){
        console.log("Issue on params"+err);
        res.status(404);
        return res.send("Wrong params");


    }



};

//Post function
//addDoc

//Post function
//addDoc


export const addAtmos = (req,res,next) => {
   try{
       console.log(req.url,req.body);
        var docs = req.body.data;
    
    //add check on room number time and val
        docs.forEach(function(d) {
            Room.findOne({'number': d.room}, function (err, r) {
                if (err){
                    res.end();
                    return console.error(err);
    
                }
                async.series([
                        function (callback) {
    
                            var co = parseFloat(d.co);
                            var no2 = parseFloat(d.no2);
                            if(!isNaN(co) && !isNaN(no2)){
                                if(d.date.match(/\d{4}((-)\d{2}){5}/))
                                    createAtmos(d.date,d.co,d.no2, r, callback);
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



function createAtmos(date, co, no2,room,cb){
    var atmosDetail = {date:date,co:co,no2:no2,room:room};

    var atmos = new Atmosphere(atmosDetail);

    atmos.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Atmos: added');
        room.atmospheres.push(atmos);
        room.save();

        cb(null, atmos)
    }  );

}