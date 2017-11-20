/**
 Created by Guillaume Ferron on the 10/4/2017
 **/

import mongoose, { Schema } from 'mongoose';

// Define temperature schema
const temperatureSchema = new Schema({
    date: String,
    temperature: Number
});

// Export Mongoose model
export default mongoose.model('temperature', temperatureSchema);