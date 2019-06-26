import express from 'express';

function signIn(req: express.Request, res: express.Response) {
    if (req.body.login === 'john' && req.body.password === 'dorian')
        res.send({ 'login': 'success'});
    else 
        res.send({ 'login': 'fail'});
}

export {
    signIn
}