import React from 'react';
import { Link } from 'react-router-dom';

import { TripService } from '../services';

const ts = new TripService();

class Trips extends React.Component {
    readonly state;

    constructor(readonly props) {
        super(props);

        const currentPage = Number(this.props.match.params.pageNumber);

        this.state = {
            trips: [],
            tripsCount: 0,
            tripsPerPage: 2,
            currentPage: currentPage >= 0 ? currentPage : 1
        }
        const skip = (this.state.currentPage - 1) * this.state.tripsPerPage;
        console.log(skip, this.state.tripsPerPage);
        ts.getTrips({ skip, limit: this.state.tripsPerPage })
            .then(data => {
                this.setState({ trips: data.trips, tripsCount: data.tripsCount });
            })

    }

    componentDidUpdate() {
        const newPage = Number(this.props.match.params.pageNumber) || 1;
        if (this.state.currentPage !== newPage) {
            const skip = (newPage - 1) * this.state.tripsPerPage;
            console.log('lol');
            ts.getTrips({ skip, limit: this.state.tripsPerPage })
                .then(data => {
                    console.log(data);
                    this.setState({ trips: data.trips, tripsCount: data.tripsCount, currentPage: newPage});
                })
        }
    }

    render() {
        const currentPage = this.state.currentPage;
        const pages = Math.ceil(this.state.tripsCount / this.state.tripsPerPage);
        return (
            <div>
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
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        { currentPage > 1 && 
                            <li className="page-item">
                                <Link to={`/trips/${currentPage - 1}`} className="page-link">Previous</Link>
                            </li>
                        }
                        {
                            Array(pages).map((el, index) => {
                                const page = index + 1;
                                return <li className="page-item">
                                    <Link to={`/trips/${page}`} className="page-link">{page}</Link>
                                </li>
                            })
                        }
                        { currentPage < pages && 
                            <li className="page-item">
                                <Link to={`/trips/${currentPage + 1}`} className="page-link">Next</Link>
                            </li> 
                        }

                    </ul>
                </nav>
            </div>
        );
    }
}

export {
   Trips 
}