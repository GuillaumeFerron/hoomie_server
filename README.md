# hoomie_server


26/11/17:

 Warning : we must be extremely careful with how our model are exported : if there is a capital we must use a capital when we referenced it.
 (especially for populate function to work)
apparently we must be careful with export default and module.exports. When we use export default something the xexport is actually done like that :
exports:{
    default:{
        something
    }
}

so the import has to be made that way : import something from myfile
if we use module.exports = something then we have
exports :{
    something
}
and we must import with : import {something} from myfile
________________________________________________________________________________________________________________________


/To run the script launch : npm run-script populate in the default directory/
________________________________________________________________________________________________________________________

express : server-side framework using node.js
mongoose : Mongoose is a MongoDB(an open source NoSQL database that uses a document-oriented data model) object modeling tool designed to work in an asynchronous environment.
nodemon : allows the serveur to be instantly updated when changes occur during development
body-parser : This parses the body portion of an incoming HTTP request and makes it easier to extract different parts of the contained information. For example, you can use this to read POST parameters.
morgan: An HTTP request logger middleware for node.

Object Data Model ("ODM") / Object Relational Model ("ORM"). An ODM/ORM represents the website's data as JavaScript objects, which are then mapped to the underlying database.

For the database : 
Each Residency has a different database in which there are persons, rooms and credentials. In each romm there are different collection : temperatures, gas data, lights and solar lights, sounds ... in each collection there are many documents representing a date and the data we need .
