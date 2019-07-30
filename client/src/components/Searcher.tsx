import React from 'react';
import { TripService } from '../services';

class Searcher extends React.Component {
    readonly state;

    constructor(props) {
        super(props);

        const ts = new TripService();
        this.state = {
            trips: []
        }

        ts.getTrips()
            .then(data => {
                this.setState({ trips: data.trips });
            })
    }

    render() {
        return (
            <div>
                <div>
                {
                    this.state.trips.map((el, index ) => {
                        return <div key={index} className="shadow-sm p-3 mb-2 bg-white row">
                            <div className="offer-img bg-dark">Image</div>
                            <div className="col-5">
                                <div className="row mt-4">
                                    <div className="col-auto">
                                        <h3 className="d-inline yoo-text-1">{el.startingPoint}</h3>
                                        <p className="text-center">{el.startDate}</p>
                                    </div>
                                    <div className="col text-center">
                                        <svg height="50px" width="100%" xmlns="http://www.w3.org/2000/svg">
                                            <line x1="0" y1="25" x2="100%" y2="25" stroke="#CCCCCC" strokeWidth="2" />
                                        </svg>
                                        <p>5 days</p>
                                    </div>
                                    <div className="col-auto">
                                        <h3 className="d-inline yoo-text-1">{el.destinationPoint}</h3>
                                        <p className="text-center">{el.endDate}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                Transport: {el.transport}<br />
                                Transport: {el.transportType}<br />
                                Number of people: {el.numberOfPeople}<br />
                                Available slots: 3<br />
                                Accommodation: {el.accommodation}<br />
                            </div>
                            <div className="col">
                                <button className="btn btn-sm btn-outline-primary">Check this out!</button>
                            </div>
                        </div>
                    })
                }
                </div>
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className="page-item"><a className="page-link" href="#">Previous</a></li>
                        <li className="page-item"><a className="page-link" href="#">1</a></li>
                        <li className="page-item"><a className="page-link" href="#">2</a></li>
                        <li className="page-item"><a className="page-link" href="#">3</a></li>
                        <li className="page-item"><a className="page-link" href="#">Next</a></li>
                    </ul>
                </nav>
            </div>
        );
    }
}

export {
    Searcher
}