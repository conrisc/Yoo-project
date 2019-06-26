import express from 'express';
import * as services from './services/index.ts';

function injectAPI(app: express.Application) {
    app.post('/signin', services.signIn);
}

export {
    injectAPI
};
