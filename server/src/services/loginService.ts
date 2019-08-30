import express from 'express';
import { MongoService } from './mongoService.ts';

let ms = new MongoService();

function signIn(req: express.Request, res: express.Response) {
    const { login, password } = req.body;
    ms.find('users', { login, password })
        .then((items: any) => {
            if (items.length > 0) {
                const token: string = createSessionToken(req.body.login);
                res.send({
                    'login': req.body.login,
                    'token': token,
                    'status': 200
                });
            } else
                res.send({
                    'login': req.body.login,
                    'token': '',
                    'status': 401
                });
        });
}

function signUp(req: express.Request, res: express.Response) {
    const { login, password, name, lastName } = req.body;
    if (!login || login.length < 4)
        res.send({
            'msg': 'Login is too short!',
            'status': 400
        })
    else if (!password || password.length < 6)
        res.send({
            'msg': 'Password is too short!',
            'status': 400
        })
    else if (!name || name.length < 1)
        res.send({
            'msg': 'Name is too short!',
            'status': 400
        })
    else if (!lastName || lastName.length < 1)
        res.send({
            'msg': 'LastName is too short!',
            'status': 400
        })
    else ms.find('users', {login})
        .then((items: any) => {
            if (items.length === 0)
                ms.insert('users', { login, password, name, lastName })
                    .then(() => {
                    res.send({
                        'msg': 'User has been added!',
                        'status': 201
                    });
                })
                .catch((error: any) => {
                    res.send({
                        'msg': error.message,
                        'status': 503
                    });
                });
            else
                res.send({
                    'msg': 'User with given login already exist!',
                    'status': 400
                });
        });
}

function getUserData(req: express.Request, res: express.Response) {
    const { login } = req.body;
    ms.find('users', { login })
        .then((items: any) => {
            if (items.length === 1)
                res.send({
                    'login': login,
                    'name': items[0].name,
                    'lastName': items[0].lastName,
                    'description': items[0].description,
                    'status': 200
                });
            else 
                res.send({
                    'login': login,
                    'status': 400
                });
        });
}

function updateUserData(req: express.Request, res: express.Response) {
    const { login, password, name, lastName } = req.body;
    const data = password ? { password, name, lastName } : { name, lastName }

    ms.update('users', { login }, data)
        .then(() => {
            res.send({
                'msg': 'User data has been updated!',
                'status': 200
            })
        })
        .catch(() => {
            res.send({
                'msg': 'User data has failed!',
                'status': 400
            })
        });
}

function isLoggedIn(req: express.Request, res: express.Response) {
    const { login, token } = req.body;
    ms.find('logged', { login, token })
        .then((items: any) => {
            if (items.length === 1)
                res.send({
                    'login': login,
                    'status': 200
                })
            else
                res.send({
                    'login': login,
                    'status': 400
                });
        });
}

function createSessionToken(login: string): string {
    ms.deleteOne('logged', {login});

    let token = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    ms.insert('logged', {
        token,
        login
    })

    // function isUnique(token): boolean {
    //     return ms.find('logged', {token: token})
    //         .then((items: any) => {
    //             return items.length === 0;
    //         })
    // }

    return token;
}

export {
    signIn,
    signUp,
    getUserData,
    updateUserData,
    isLoggedIn
}