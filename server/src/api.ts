import express from 'express';
import * as services from './services/index.ts';

const ts  = new services.TripService();


function injectAPI(app: express.Application) {
    app.post('/signin', services.signIn);
    app.post('/signup', services.signUp);
    app.post('/isloggedin', services.isLoggedIn);
    app.post('/trip/create', ts.createTrip);
    app.get('/trips', ts.getTrips);
    app.get('/trip/:tripId', ts.getTrip);
}

export {
    injectAPI
};
