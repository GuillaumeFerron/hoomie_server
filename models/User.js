/**
 Created by Lisa Martini on the 11/18/2017
 **/

import mongoose, { Schema } from 'mongoose';
import Credential from './Credential';
import User from './User';
import Room from './Room';
import moment from 'moment';

// Define person schema
const personSchema = new Schema({
    first_name:{type:String,required:true,max: 100},
    last_name: {type:String,uppercase:true,required:true,max: 100},
    date_of_birth :{type:Date},
    room : {type:Schema.Types.ObjectId, ref: 'Room'},
    //friends : [Person],
    access : {type:Schema.Types.ObjectId, ref: 'Credential'}
});

// Virtual for user's full name
personSchema
    .virtual('name')
    .get(function () {
        return this.first_name + ' ' + this.last_name;
    });

//virtual user's age
personSchema
    .virtual('age')
    .get(function () {
        var years = moment().diff(this.date_of_birth,'years');
        return years+' ans';
    });


// Export Mongoose model
export default mongoose.model('User', personSchema);