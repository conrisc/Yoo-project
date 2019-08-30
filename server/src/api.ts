import express from 'express';
import * as services from './services/index.ts';

const ts  = new services.TripService();


function injectAPI(app: express.Application) {
    app.post('/signin', services.signIn);
    app.post('/signup', services.signUp);
    app.post('/isloggedin', services.isLoggedIn);
    app.post('/getuserdata', services.getUserData);
    app.post('/updateuserdata', services.updateUserData);
    app.post('/trip/create', ts.createTrip);
    app.post('/trip/images', ts.updateImages);
    app.get('/trip/:tripId', ts.getTrip);
    app.post('/trip/request/ask', ts.requestTrip);
    app.post('/trip/request/update', ts.updateRequestTrip);
    app.post('/trip/request/remove', ts.removeRequestTrip);
    app.post('/trip/requests', ts.getTripRequests);
    app.get('/trips/:skip?/:limit?', ts.getTrips);
    app.post('/trips/user', ts.getUserTrips);
    app.post('/trip/participant/remove', ts.removeParticipant);
}

export {
    injectAPI
};
