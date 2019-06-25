import * as Services from './services/';

function injectAPI(app) {
    app.post('/signin', Services.signIn);
}

export {
    injectAPI
};
