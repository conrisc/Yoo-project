import express from 'express';
import { MongoService } from './mongoService.ts';

let ms = new MongoService();

class TripService {
    public createTrip(req: express.Request, res: express.Response) {
        const data = req.body;
        ms.insert('trips', data)
            .then(() => {
                res.send({
                    'msg': 'Trip has been added!',
                    'status': 201
                });
            })
    }

    public getTrips(req: express.Request, res: express.Response) {
        ms.find('trips', {})
            .then((trips: []) => {
                res.send({
                    'trips': trips
                })
            })
    }
}

export {
    TripService
}