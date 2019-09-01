import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'

import { TripService } from '../services';
import { Pagination } from './Pagination';
import { SingleDetail } from './SingleDetail';

const ts = new TripService();

class Trips extends React.Component {
    readonly state;

    constructor(readonly props) {
        super(props);

        this.state = {
            trips: [],
            tripsCount: 0,
            tripsPerPage: 5,
            currentPage: Number(this.props.match.params.pageNumber) || 1,
            author: this.props.match.params.author || ''
        }
        this.updateTrips(this.state.currentPage, this.state.author);
    }

    componentDidUpdate() {
        const newPage = Number(this.props.match.params.pageNumber) || 1;
        const author = this.props.match.params.author || '';
        if (this.state.currentPage !== newPage || this.state.author != author)
            this.updateTrips(newPage, author);
    }

    updateTrips(page, author) {
        const skip = (page - 1) * this.state.tripsPerPage;
        ts.getTrips({ skip, limit: this.state.tripsPerPage, author })
            .then(data => {
                this.setState({ trips: data.trips, tripsCount: data.tripsCount, currentPage: page, author});
            })
    }

    removeTrip(tripId) {
        ts.deleteTrip({ tripId })
            .then(response => {
                this.updateTrips(this.state.currentPage, this.state.author);
            });
    }

    render() {
        const currentPage = this.state.currentPage;
        const pages = Math.ceil(this.state.tripsCount / this.state.tripsPerPage);
        return (
            <div>
                <div className="mx-5">
                {
                    this.state.trips.length > 0 ?
                        this.state.trips.map((trip, index ) => {
                            const availableSpots = trip.numberOfPeople - (trip.participants ? trip.participants.length : 0);
                            const tripDuration = (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24);
                            return <div key={index} className="shadow-sm p-3 mb-2 bg-white row">
                                <div className="offer-img bg-dark">
                                    {trip.images && trip.images[0] &&
                                        <img src={`data:image/jpg;base64, ${trip.images[0]}`} />
                                    }
                                </div>
                                <div className="col-6">
                                    <div className="row mt-4">
                                        <div className="col-auto">
                                            {trip.startingPoint && <h3 className="d-inline yoo-text-1">{trip.startingPoint.value}</h3>}
                                            <p className="text-center">{trip.startDate}</p>
                                        </div>
                                        <div className="col text-center">
                                            <svg height="50px" width="100%" xmlns="http://www.w3.org/2000/svg">
                                                <line x1="0" y1="25" x2="100%" y2="25" stroke="#CCCCCC" strokeWidth="2" />
                                            </svg>
                                            <p>{tripDuration} days</p>
                                        </div>
                                        <div className="col-auto">
                                            {trip.destinationPoint && <h3 className="d-inline yoo-text-1">{trip.destinationPoint.value}</h3>}
                                            <p className="text-center">{trip.endDate}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <SingleDetail compact={true} infoName="Transport" infoValue={trip.transport} />
                                    <SingleDetail compact={true} infoName="Type of transport" infoValue={trip.transport !== 'own' ? trip.transportType : '-'} />
                                    <SingleDetail compact={true} infoName="Number of people" infoValue={trip.numberOfPeople} />
                                    <SingleDetail compact={true} infoName="Available spots" infoValue={availableSpots} />
                                    <SingleDetail compact={true} infoName="Accommodation" infoValue={trip.accommodation} />
                                    <SingleDetail compact={true} infoName="Author" infoValue={<Link to={`/profile/${trip.author}`} className="text-decoration-none">{trip.author}</Link>} />
                                </div>
                                <div className="col mt-5">
                                    <Link to={`/trip/${trip._id}`} className="btn btn-primary btn-sm m-1 w-100">Check</Link>
                                    {this.props.login === trip.author &&
                                        <button className="btn btn-danger btn-sm m-1 w-100" onClick={() => this.removeTrip(trip._id)}>Remove</button>
                                    }
                                </div>
                            </div>
                        }) :
                        <h6>There are no trips</h6>
                }
                </div>
                <Pagination currentPage={currentPage} pages={pages} linkBefore="/trips" linkAfter={`${this.state.author}`}  />
            </div>
        );
    }
}


const mapStateToProps = (state) => {
  return { login: state.login };
};
const mapDispatchToProps = () => {
  return {}
};

// @ts-ignore
Trips = connect(mapStateToProps, mapDispatchToProps)(Trips);

export {
   Trips 
}