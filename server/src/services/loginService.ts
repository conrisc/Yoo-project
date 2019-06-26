import express from 'express';

function signIn(req: express.Request, res: express.Response) {
    if (req.body.login === 'john' && req.body.password === 'dorian')
        res.send({
            'login': req.body.login,
            'status': 200
        });
    else 
        res.send({
            'login': req.body.login,
            'status': 401
        });
}

export {
    signIn
}