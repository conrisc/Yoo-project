import express from 'express';
import { MongoService } from './mongoService.ts';

let ms = new MongoService();

class TripService {
    public create(req: express.Request, res: express.Response) {
        const data = req.body;
        ms.insert('trips', data)
            .then(() => {
                res.send({
                    'msg': 'Trip has been added!',
                    'status': 201
                });
            })
    }
}

export {
    TripService
}