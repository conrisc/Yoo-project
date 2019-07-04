import express from 'express';
import * as services from './services/index.ts';

function injectAPI(app: express.Application) {
    app.post('/signin', services.signIn);
    app.post('/signup', services.signUp);
    app.post('/isloggedin', services.isLoggedIn);
}

export {
    injectAPI
};
