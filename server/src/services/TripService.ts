import express from 'express';
import { MongoService } from './mongoService.ts';
import { ObjectId } from 'mongodb';

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

    public getTrip(req: express.Request, res: express.Response) {
        const idFiled = new ObjectId(req.params.tripId);
        ms.find('trips', { _id: idFiled })
            .then(trip => {
                res.send({
                    'trip': trip
                });
            });
    }

    public requestTrip(req: express.Request, res: express.Response) {
        const { login, tripId, requestSubstantiation } = req.body;
        const status = 'pending'
        ms.insert('tripRequests', { login, tripId, requestSubstantiation, status })
            .then(() => {
                res.send({
                    'msg': 'Request has been sent!',
                    'status': 201
                });
            });
    }

    public updateRequestTrip(req: express.Request, res: express.Response) {
        const { requestId, status} = req.body;
        const id = new ObjectId(requestId);
        ms.update('tripRequests', { _id: id }, { status })
            .then(() => {
                res.send({
                    'msg': 'Request has been updated!',
                    'status': 200
                })
            })
    }

    public removeRequestTrip(req: express.Request, res: express.Response) {
        const id = new ObjectId(req.body.requestId);
        ms.deleteOne('tripRequests', { _id: id })
            .then(() => {
                res.send({
                    'msg': 'Request has been deleted!',
                    'status': 200
                })
            });
    }

    public getTripRequests(req: express.Request, res: express.Response) {
        const { tripId } = req.body;
        ms.find('tripRequests', { tripId })
            .then((requests: []) => {
                res.send({
                    requests
                });
            });
    }

    public getUserTrips(req: express.Request, res: express.Response) {
        const author = req.body.author;
        ms.find('trips', { author })
            .then((trips: []) => {
                res.send({
                    'trips': trips
                });
            });
    }
}

export {
    TripService
}