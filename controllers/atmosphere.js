/**
 Created by Lisa Martini on the  01/09/2018
 **/
import Atmosphere from '../models/Atmosphere';
import Room from '../models/Room';
import async from 'async';


//GET fonction
//All atmospheres
export const allAtmospheres = (req, res, next) => {
    Room.findOne({'number':req.params.room},function(err,r){
        if(err) res.json({"error":err});
        Atmosphere.find({'room':r}, {}).exec((err, atmospheres) => res.json(
            { data: atmospheres}
        ));

    });

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
    Room.findOne({'number':req.params.room},function(err,r) {
        if (err) res.json({"error": err});
        Atmosphere.find({'room': r}, {}).exec(function (err, atmospheres) {
            let sortedAtmos = [];
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
            return res.json({data: sortedAtmos}
            )
        });
    });
};

//Specific day atmosphere
export const dayAtmosphere = (req, res, next) => {
    const period = req.params.date.split("-");

    Room.findOne({'number':req.params.room},function(err,r) {
        if (err) res.json({"error": err});
        Atmosphere.find({'room': r}, {}).exec(function (err, atmospheres) {
            var averageAtmos = computeAverage(atmospheres,3,period);
            return res.json({data: averageAtmos}
            )
        });
    });
};

//Specific month atmosphere
export const monthAtmosphere = (req, res, next) => {
    const period = req.params.date.split("-");
    Room.findOne({'number':req.params.room},function(err,r) {
        if (err) res.json({"error": err});
        Atmosphere.find({'room': r}, {}).exec(function (err, atmospheres) {
            var averageAtmos = computeAverage(atmospheres,2,period);
            return res.json({data: averageAtmos});
        });
    });
};

//Specific year atmosphere
export const yearAtmosphere = (req, res, next) => {
    const period = req.params.date.split("-");
    Room.findOne({'number':req.params.room},function(err,r) {
        if (err) res.json({"error": err});
        Atmosphere.find({'room': r}, {}).exec(function (err, atmospheres) {
            var averageAtmos = computeAverage(atmospheres,1,period);
            return res.json({data: averageAtmos});
        });
    });
};

function computeAverage(atmospheres,date,period ){
    let goodAtmos = new Map();
    let averageAtmos = [];
    // console.log(atmospheres, period);
    atmospheres.forEach(function(t){
        let curr = t.date.split("-");
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
                val.push(t.value);
                goodAtmos.set(curr[date],val);
            }else{
                goodAtmos.set(curr[date],[t.value]);
            }
        }
    });

    return  computeMapAverage(goodAtmos) ;
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
    var room = req.params.room;
    var day = req.params.date.split("-");
    if(room == "all"){
        Atmosphere.find({}, {}).exec(function (err, atmospheres) {
            var averageAtmos = computeAverage(atmospheres,3,day);
            res.json({data:averageAtmos});
        });
    }else{
        res.redirect('http://hoomieserver.herokuapp.com/'+room+'/atmosphere/day/'+req.params.date);
    }
};


//Average per month for one room
export const averageMonth = (req,res,next) => {
    var room = req.params.room;
    var month = req.params.date.split("-");
    if(room == "all"){
        Atmosphere.find({}, {}).exec(function (err, atmospheres) {
            var averageAtmos = computeAverage(atmospheres,2,month);
            res.json({data:averageAtmos});
        });
    }else{
        res.redirect('http://hoomieserver.herokuapp.com/'+room+'/atmosphere/month/'+req.params.date);
    }
};


//Average per year for one room
export const averageYear = (req,res,next) => {
    var room = req.params.room;
    var year = req.params.date.split("-");

    if(room == "all"){
        Atmosphere.find({}, {}).exec(function (err, atmospheres) {
            var averageAtmos = computeAverage(atmospheres,1,year);
            res.json({data:averageAtmos});
        });

    }else{
        res.redirect('http://hoomieserver.herokuapp.com/'+room+'/atmosphere/year/'+year);
    }
};

//Post function
//addDoc


export const addAtmos = (req,res,next) => {
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