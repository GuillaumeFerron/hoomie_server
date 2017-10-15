/**
 Created by Guillaume Ferron on the 10/6/2017
 **/

import express, { Router } from 'express';
// Import index action from movies controller
import { temperature } from './controllers/temperature';

// Initialize the router
const router = Router();

router.route('/temperature')
    .get(temperature);

export default router;