import express from 'express';
import { ObjectId } from 'mongodb';
import { IncomingForm } from 'formidable';
import * as fs from 'fs';

import { MongoService } from './mongoService.ts';

let ms = new MongoService();

class TripService {

    public createTrip(req: express.Request, res: express.Response) {
        const data = req.body;
        ms.insert('trips', data)
            .then((response) => {
                console.log(response);
                res.send({
                    'msg': 'Trip has been added!',
                    'tripId': response.insertedId,
                    'status': 201
                });
            })
    }

    public updateImages(req: express.Request, res: express.Response) {
        let form = new IncomingForm();
        form.parse(req, (err: any, fields: any, files: any) => {
            const images = Object.values(files).map((img: any) => {
                const fileBuffer = fs.readFileSync(img.path);
                const imgBase64 = fileBuffer.toString('base64');
                return imgBase64;
            });
            const tripId = new ObjectId(fields.tripId);

            const data = {
                images
            }

            ms.update('trips', { _id: tripId }, data)
                .then(() => {
                    res.send({
                        'msg': 'Images has been added!',
                        'status': 200
                    })
                })
        });
    }

    public getTrips(req: express.Request, res: express.Response) {
        const skip = Number(req.params.skip || 0);
        const limit = Number(req.params.limit || 0);
        Promise.all([
            ms.find('trips', {}, skip, limit),
            ms.count('trips', {})
        ])
        .then(([trips, count]) => {
                res.send({
                    'trips': trips,
                    'tripsCount': count
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
        const id = new ObjectId(tripId);
        const status = 'pending'
        ms.find('trips', { _id: id, participants: login })
            .then(trips => {
                if (trips.length > 0 ) {
                    res.send({
                        'msg': 'You are already singed for this trip',
                        'status': 304
                    })
                } else {
                    ms.find('tripRequests', { login, tripId })
                        .then(requests => {
                            if (requests.length > 0) {
                                res.send({
                                    'msg': 'You are already singed for this trip',
                                    'status': 304
                                })
                            } else {
                                ms.insert('tripRequests', { login, tripId, requestSubstantiation, status })
                                    .then(() => {
                                        res.send({
                                            'msg': 'Request has been sent!',
                                            'status': 201
                                        });
                                    });
                            }
                        });
                }
            })
    }

    public updateRequestTrip(req: express.Request, res: express.Response) {
        const { requestId, status} = req.body;
        const id = new ObjectId(requestId);
        if (status === 'approved')
            ms.find('tripRequests', { _id: id })
                .then(requests => {
                    const { login, tripId } = requests[0];
                    const id2 = new ObjectId(tripId);
                    ms.deleteOne('tripRequests', { _id: id });
                    ms.push('trips', { _id: id2 }, { participants: login })
                })
        else
            ms.update('tripRequests', { _id: id }, { status })
                .then(() => {
                    res.send({
                        'msg': 'Request has been updated!',
                        'status': 200
                    });
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

    public removeParticipant(req: express.Request, res: express.Response) {
        const { tripId, login } = req.body;
        const id = new ObjectId(tripId);
        console.log(id, login);
        ms.pull('trips', { _id: id }, { participants: login })
            .then((e) => {
                res.send({
                    'status': 200
                })
            })
    }
}

export {
    TripService
}