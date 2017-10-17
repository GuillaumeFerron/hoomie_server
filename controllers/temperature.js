/**
 Created by Guillaume Ferron on the 10/6/2017
 **/
import Temperature from '../models/temperature'

export const temperature = (req, res, next) => {
    Temperature.find().lean().exec((err, temperatures) => res.json(
        // Iterate through each movie
        { temperature: temperatures.map(temperature => ({
            ...temperature
        }))}
    ));
};