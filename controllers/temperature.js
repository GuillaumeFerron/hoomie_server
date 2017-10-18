/**
 Created by Guillaume Ferron on the 10/6/2017
 **/
import Temperature from '../models/temperature'

export const temperature = (req, res, next) => {
    Temperature.find({}, {'temperature': 1, _id: 0}).sort({_id:-1}).limit(1).exec((err, temperatures) => res.json(

        { temperature: temperatures}
    ));
};