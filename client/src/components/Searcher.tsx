import React from 'react';

class Searcher extends React.Component {
    data = [
        this.createTrip(1, "Place1", "Place2", "On your own", 5, "1.03.2019", "5.04.2019"),
        this.createTrip(2, "Place3", "Place4", "Bus", 3, "1.03.2019", "20.08.2020"),
        this.createTrip(3, "Place5", "Place6", "Plane", 2, "1.03.2019", "5.04.2019"),
        this.createTrip(4, "Place7", "Place8", "On your own", 9, "21.11.2019", "28.12.2019")
    ];

    createTrip(id: any, start: any, destination: any, transport: any, numberOfPeople: any, dateOfDeparture: any, dateOfReturn: any): any {
        return {
            id,
            start,
            destination,
            transport,
            numberOfPeople,
            dateOfDeparture,
            dateOfReturn
        };
    }

    render() {
        return (
            <div>
                <div>
                {
                    this.data.map(el => {
                        return <div key={el.id} className="shadow-sm p-3 mb-2 bg-white row">
                            <div className="offer-img bg-dark">Image</div>
                            <div className="col-5">
                                <div className="row mt-4">
                                    <div className="col-auto">
                                        <h3 className="d-inline yoo-text-1">{el.start}</h3>
                                        <p className="text-center">{el.dateOfDeparture}</p>
                                    </div>
                                    <div className="col text-center">
                                        <svg height="50px" width="100%" xmlns="http://www.w3.org/2000/svg">
                                            <line x1="0" y1="25" x2="100%" y2="25" stroke="#CCCCCC" stroke-width="2" />
                                        </svg>
                                        <p>5 days</p>
                                    </div>
                                    <div className="col-auto">
                                        <h3 className="d-inline yoo-text-1">{el.destination}</h3>
                                        <p className="text-center">{el.dateOfReturn}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                Transport: {el.transport}<br />
                                Number of people: {el.numberOfPeople}<br />
                                Available slots: 3<br />
                                Accommodation: Provided<br />
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