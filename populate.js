/**
 Created by Guillaume Ferron on the 10/6/2017
 **/

import mongoose from 'mongoose';
import Temperature from './models/temperature';

const temperatures = [
    {
        date : '16102017210537',
        temperature: 10
    },
    {
        date : '16102017210545',
        temperature: 12
    },
    {
        date : '16102017210550',
        temperature: 14
    },
    {
        date : '16102017210555',
        temperature: 16
    },
    {
        date : '16102017210600',
        temperature: 18
    },
    {
        date : '16102017210605',
        temperature: 20
    },
];

// Connect to MongoDB
mongoose.connect('mongodb://localhost/temperatures');

// Go through each movie
temperatures.map(data => {
    // Initialize a model with movie data
    const temperature = new Temperature(data);
    // and save it into the database
    temperature.save();
});
