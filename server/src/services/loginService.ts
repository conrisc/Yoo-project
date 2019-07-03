import express from 'express';
import { MongoService } from './mongoService.ts';

let ms = new MongoService();

function signIn(req: express.Request, res: express.Response) {
    ms.find('users', req.body)
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
    const { login, password, name, lastName } = req.body;
    if (!login || login.length < 4) res.send({ 'msg': 'Login is too short!' })
    else if (!password || password.length < 6) res.send({ 'msg': 'Password is too short!' })
    else if (!name || name.length < 1) res.send({ 'msg': 'Name is too short!' })
    else if (!lastName || lastName.length < 1) res.send({ 'msg': 'LastName is too short!' })
    else ms.find('users', {login})
        .then((items: any) => {
            if (items.length === 0)
                ms.insert('users', { login, password, name, lastName })
                    .then(() => {
                    res.send({'msg': 'User has been added!'});
                })
                .catch((error: any) => {
                    res.send({ 'msg': error.message });
                });
            else 
                res.send({ 'msg': 'User with given login already exist!'});
        });

}

export {
    signIn,
    signUp
}