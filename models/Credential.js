/**
 Created by Lisa Martini on the 11/18/2017
 **/

import mongoose, { Schema } from 'mongoose';

// Define credential schema
const credentialSchema = new Schema({
    _id : Schema.Types.ObjectId,
    login:{type:String,required:true},
    password: {type:String,required:true},
    //allows to know if it's the administrator or not
    admin :{type:Boolean,default:false,required:true}
});

// Export Mongoose model
export default mongoose.model('credential', credentialSchema);