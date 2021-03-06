/**
 Created by Guillaume Ferron on the 10/6/2017
 Modified by Lisa Martini since nov 2017
 **/

import express, { Router } from 'express';
// Import index action from movies controller
import * as TempController from './controllers/temperature';
import * as AtmosController from './controllers/atmosphere';

// Initialize the router
const router = Router();


//GET Temp routes
//All temperatures
router.route('/:room/temperature/all').get(TempController.allTemperatures);

//Last Temperature
router.route('/:room/temperature/last').get(TempController.lastTemperature);

//Temperatures ulterior to a given date
//router.route('/:room/temperature/period/:date').get(TempController.periodTemperature);

//Specific day temperature
router.route('/:room/temperature/day/:date').get(TempController.dayTemperature);

//Specific month temperature
router.route('/:room/temperature/month/:date').get(TempController.monthTemperature);

//Specific year temperature
router.route('/:room/temperature/year/:date').get(TempController.yearTemperature);

//Average per day for one room
router.route('/admin/temperature/averageDay/:date/:room').get(TempController.averageDay);
//Average per month for one room
router.route('/admin/temperature/averageMonth/:date/:room').get(TempController.averageMonth);
//Average per year for one room
router.route('/admin/temperature/averageYear/:date/:room').get(TempController.averageYear);


//GET Atmos routes
//All atmospheres
router.route('/:room/atmosphere/all').get(AtmosController.allAtmospheres);

//Last Atmosphere
router.route('/:room/atmosphere/last').get(AtmosController.lastAtmosphere);

//Atmospheres ulterior to a given date
//router.route('/:room/atmosphere/period/:date').get(AtmosController.periodAtmosphere);

//Specific day atmosphere
router.route('/:room/atmosphere/day/:date').get(AtmosController.dayAtmosphere);

//Specific month atmosphere
router.route('/:room/atmosphere/month/:date').get(AtmosController.monthAtmosphere);

//Specific year atmosphere
router.route('/:room/atmosphere/year/:date').get(AtmosController.yearAtmosphere);

//Average per day for one room
router.route('/admin/atmosphere/averageDay/:date/:room').get(AtmosController.averageDay);
//Average per month for one room
router.route('/admin/atmosphere/averageMonth/:date/:room').get(AtmosController.averageMonth);
//Average per year for one room
router.route('/admin/atmosphere/averageYear/:date/:room').get(AtmosController.averageYear);



//POST Temp Routes
router.route('/sensors/addTemp').post(TempController.addTemp);
//POST Atmos Routes
router.route('/sensors/addAtmos').post(AtmosController.addAtmos);
export default router;