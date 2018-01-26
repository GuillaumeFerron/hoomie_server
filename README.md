# hoomie_server

26/01/18:

Current server's state :
- Only temperatures and Atmospheres can be added and displayed
- Several script exists to populate the db as wished
- Right now on temperatures controller :
    *you can get the mean value for a room by year, month or day
    *you can add a temperature depending on information received
    *you can send mean value by year, month and day for all rooms if all is true (cf compute Average ) the data sent to the application is as follow :
    {data:[{date:d1,'203':val203,'204':val204,'205':val205},{date:d2,'203':val203,'204':val204,'205':val205}...]}
    It's not the best way to send this data but it could have meant refactoring most of the server and we didn't have time to do it.
- Right now on atmospheres controller :
    *you can get the mean value for Co and No2 for a room by year, month or day
    *you can add a atmospheres depending on information received
    *you can send mean value by year, month or day but all rooms are counted in the average not the same distinction as in temperatures controller
    (because, there were not enough time to do it, and the processing in the application didn't work for temperatures of all rooms, so it wasn't useful)


Many improvements could have been performed on this server but it is useless while the mobile application cannot display correctly any information.
No work has been made to create and authenticate users in db due to lack of time.
Do remember that when a change is made it must be committed and pushed to master of the current github repo but mainly to heroku master repo to be effective.


________________________________________________________________________________________________________________________
27/11/2017:
heroku restart --app hoomieserver
 Warning to push anything on heroku server once need to use git shell + heroku login otherwise it doesn't work
________________________________________________________________________________________________________________________
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
