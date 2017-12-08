/**
 Created by Guillaume Ferron on the 10/6/2017
 **/

import express, { Router } from 'express';
// Import index action from movies controller
import * as TempController from './controllers/temperature';

// Initialize the router
const router = Router();


//GET Temp routes
//All temperatures
router.route('/temperature/all').get(TempController.allTemperatures);

//Last Temperature
router.route('/temperature/last').get(TempController.lastTemperature);

//Temperatures ulterior to a given date
router.route('/temperature/period/:date').get(TempController.periodTemperature);

//Specific day temperature
router.route('/temperature/day/:date').get(TempController.dayTemperature);

//Specific month temperature
router.route('/temperature/month/:date').get(TempController.monthTemperature);

//Specific year temperature
router.route('/temperature/year/:date').get(TempController.yearTemperature);


//POST Temp Routes
router.route('/temperature/addDoc').post(TempController.addTemp);
export default router;