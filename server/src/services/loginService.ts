import express from 'express';
import { MongoService } from './mongoService.ts';

let ms = new MongoService();

function signIn(req: express.Request, res: express.Response) {
    ms.find(req.body.login, req.body.password)
        .then((items: any) => {
            if (items.length > 0)
                res.send({
                    'login': req.body.login,
                    'status': 200
                });
            else
                res.send({
                    'login': req.body.login,
                    'status': 401
                });
        });
}

function signUp(req: express.Request, res: express.Response) {
    ms.insert(req.body.login, req.body.password)
        .then(() => {
            res.send({'msg': 'User has been added!'});
        })
}

export {
    signIn,
    signUp
}