import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

import { TripService } from '../services';

class MyTrips extends React.Component {
    readonly state;

    constructor(readonly props) {
        super(props);

        this.state = {
            trips: []
        }

        const ts = new TripService();
        ts.getUserTrips(this.props.login)
            .then(data => {
                this.setState({ trips: data.trips });
            })
    }

    render() {
        return (
            <div>
                <Link to='/create-trip' className="btn btn-primary btn-sm">Create trip</Link>
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
                                <Link to={`/trip/${el._id}`} className="btn btn-primary btn-sm">Check this out!</Link>
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

const mapStateToProps = (state) => {
  return { login: state.login };
};
const mapDispatchToProps = () => {
  return {}
};

// @ts-ignore
MyTrips = connect(mapStateToProps, mapDispatchToProps)(MyTrips);

export {
   MyTrips 
}