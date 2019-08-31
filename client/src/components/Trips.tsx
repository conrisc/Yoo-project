import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'

import { TripService } from '../services';
import { Pagination } from './Pagination';

const ts = new TripService();

class Trips extends React.Component {
    readonly state;

    constructor(readonly props) {
        super(props);

        this.state = {
            trips: [],
            tripsCount: 0,
            tripsPerPage: 10,
            currentPage: Number(this.props.match.params.pageNumber) || 1,
            author: this.props.match.params.author || ''
        }
        const skip = (this.state.currentPage - 1) * this.state.tripsPerPage;
        ts.getTrips({ skip, limit: this.state.tripsPerPage, author: this.state.author })
            .then(data => {
                this.setState({ trips: data.trips, tripsCount: data.tripsCount });
            })

    }

    componentDidUpdate() {
        const newPage = Number(this.props.match.params.pageNumber) || 1;
        const author = this.props.match.params.author || '';
        if (this.state.currentPage !== newPage ||
            this.state.author != author
           ) {
            const skip = (newPage - 1) * this.state.tripsPerPage;
            ts.getTrips({ skip, limit: this.state.tripsPerPage, author })
                .then(data => {
                    this.setState({ trips: data.trips, tripsCount: data.tripsCount, currentPage: newPage, author});
                })
        }
    }

    render() {
        const currentPage = this.state.currentPage;
        const pages = Math.ceil(this.state.tripsCount / this.state.tripsPerPage);
        return (
            <div>
                { this.state.author === this.props.login &&
                    <Link to='/create-trip' className="btn btn-primary btn-sm my-3">Create a trip</Link>
                }
                <div>
                {
                    this.state.trips.map((trip, index ) => {
                        return <div key={index} className="shadow-sm p-3 mb-2 bg-white row">
                            <div className="offer-img bg-dark">
                                {trip.images && trip.images[0] &&
                                    <img src={`data:image/jpg;base64, ${trip.images[0]}`} />
                                }
                            </div>
                            <div className="col-5">
                                <div className="row mt-4">
                                    <div className="col-auto">
                                        {trip.startingPoint && <h3 className="d-inline yoo-text-1">{trip.startingPoint.text}</h3>}
                                        <p className="text-center">{trip.startDate}</p>
                                    </div>
                                    <div className="col text-center">
                                        <svg height="50px" width="100%" xmlns="http://www.w3.org/2000/svg">
                                            <line x1="0" y1="25" x2="100%" y2="25" stroke="#CCCCCC" strokeWidth="2" />
                                        </svg>
                                        <p>5 days</p>
                                    </div>
                                    <div className="col-auto">
                                        {trip.destinationPoint && <h3 className="d-inline yoo-text-1">{trip.destinationPoint.text}</h3>}
                                        <p className="text-center">{trip.endDate}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                Transport: {trip.transport}<br />
                                Transport: {trip.transportType}<br />
                                Number of people: {trip.numberOfPeople}<br />
                                Available slots: 3<br />
                                Accommodation: {trip.accommodation}<br />
                            </div>
                            <div className="col">
                                <Link to={`/trip/${trip._id}`} className="btn btn-primary btn-sm">Check this out!</Link>
                            </div>
                        </div>
                    })
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