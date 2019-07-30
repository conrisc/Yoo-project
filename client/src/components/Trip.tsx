import React from 'react';

import { TripService } from '../services';

class Trip extends React.Component {
    readonly state;

    constructor(readonly props) {
        super(props);

        this.state = {
            trip: {}
        }

        const ts = new TripService();
        ts.getTrip(this.props.match.params.tripId)
            .then(data => {
                this.setState({ trip: data.trip[0] });
            })

    }

    render() {
        const trip = this.state.trip;
        return (
            <div>
                <h2>{ } </h2>
                <div className="row">
                    <div className="col-5">
                        <div className="row mt-4">
                            <div className="col-auto">
                                <h3 className="d-inline yoo-text-1">{trip.startingPoint}</h3>
                                <p className="text-center">{trip.startDate}</p>
                            </div>
                            <div className="col text-center">
                                <svg height="50px" width="100%" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="0" y1="25" x2="100%" y2="25" stroke="#CCCCCC" strokeWidth="2" />
                                </svg>
                                <p>5 days</p>
                            </div>
                            <div className="col-auto">
                                <h3 className="d-inline yoo-text-1">{trip.destinationPoint}</h3>
                                <p className="text-center">{trip.endDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-auto">
                        <img className="trip-img" src="https://wallpapershome.com/images/pages/pic_h/666.jpg"></img>
                    </div>
                    <div className="col-3">
                        Transport: {trip.transport}<br />
                        Type of transport: {trip.transportType}<br />
                        Number of people: {trip.numberOfPeople}<br />
                        Available slots: 2<br />
                        Accommodation: {trip.accommodation}<br />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        {trip.description}
                    </div>
                </div>
            </div>
        );
    }
}

export {
    Trip
}