/**
 Created by Guillaume Ferron on the 10/6/2017
 **/
import Temperature from '../models/Temperature'

//All temperatures
export const allTemperatures = (req, res, next) => {
    Temperature.find({}, {}).exec((err, temperatures) => res.json(
        { data: temperatures}
    ));
};

//Last Temperature
export const lastTemperature = (req, res, next) => {
    Temperature.find({}, {}).sort({_id:-1}).limit(1).exec((err, temperatures) => res.json(
        { data: temperatures}
    ));
};

//Temperatures ulterior to a given date
export const periodTemperature = (req, res, next) => {
    Temperature.find({}, {}).exec(function(err, temperatures) {
        let sortedTemp = [];
        const period = req.params.date.split("-");

        //Go through all temperatures in db
        for(let i = 0; i < temperatures.length; i++) {
            let curr = temperatures[i].date.split("-");
            let verif = true;
            //Check that the two formats are correct
            if(curr.length === period.length) {
                //Go through all fields of date
                for (let j = 0; j < curr.length; j++) {
                    //If the current field is lower than the one given as a url parameter, then it is anterior
                    if(parseInt(curr[j]) < parseInt(period[j])) {
                        verif = false;
                        break;
                    }
                }
                if(verif) {
                    sortedTemp.push(temperatures[i]);
                }
            }
        }
        return res.json({ data: sortedTemp}
    )});
};

//Specific day temperature
export const dayTemperature = (req, res, next) => {
    Temperature.find({}, {}).exec(function(err, temperatures) {
        let sortedTemp = [];
        const period = req.params.date.split("-");

        //Go through all temperatures in db
        for(let i = 0; i < temperatures.length; i++) {
            let curr = temperatures[i].date.split("-");
            let verif = true;
            //Check that the two formats are correct
            if(curr.length === period.length) {
                //Go through athe first three fields of date, hence the given day
                for (let j = 0; j < 3; j++) {
                    //If the current field is lower than the one given as a url parameter, then it is anterior
                    if(parseInt(curr[j]) !== parseInt(period[j])) {
                        verif = false;
                        break;
                    }
                }
                if(verif) {
                    sortedTemp.push(temperatures[i]);
                }
            }
        }
        return res.json({ data: sortedTemp}
        )});
};

//Specific month temperature
export const monthTemperature = (req, res, next) => {
    Temperature.find({}, {}).exec(function(err, temperatures) {
        let sortedTemp = [];
        const period = req.params.date.split("-");

        //Go through all temperatures in db
        for(let i = 0; i < temperatures.length; i++) {
            let curr = temperatures[i].date.split("-");
            let verif = true;
            //Check that the two formats are correct
            if(curr.length === period.length) {
                //Go through athe first two fields of date, hence the given month
                for (let j = 0; j < 2; j++) {
                    //If the current field is lower than the one given as a url parameter, then it is anterior
                    if(parseInt(curr[j]) !== parseInt(period[j])) {
                        verif = false;
                        break;
                    }
                }
                if(verif) {
                    sortedTemp.push(temperatures[i]);
                }
            }
        }
        return res.json({ data: sortedTemp}
        )});
};

//Specific year temperature
export const yearTemperature = (req, res, next) => {
    Temperature.find({}, {}).exec(function(err, temperatures) {
        let sortedTemp = [];
        const period = req.params.date.split("-");

        //Go through all temperatures in db
        for(let i = 0; i < temperatures.length; i++) {
            let curr = temperatures[i].date.split("-");
            //Check that the two formats are correct
            if(curr.length === period.length) {
                if(parseInt(curr[0]) === parseInt(period[0])) {
                    sortedTemp.push(temperatures[i]);
                }
            }
        }
        return res.json({ data: sortedTemp}
        )});
};