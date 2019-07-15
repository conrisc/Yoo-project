import React from 'react';

// @ts-ignore
const google = window.google;

class Trips extends React.Component {

    initMap() {
    }

    componentDidMount() {
        let map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 48, lng: 17},
            zoom: 4
        });
    }

    render() {
        return (
            <div>
                <div className="row py-2">
                    <div id="map" className="col-9"></div>
                    <form className="col simple-form">
                        <div className="form-group">
                            <label className="col-form-label col-form-label-sm" htmlFor="inputStart">Starting point</label>
                            <input className="form-control form-control-sm" id="inputStart" type="text" placeholder="What's your starting point?"/>
                        </div>
                        <div className="form-group">
                            <label className="col-form-label col-form-label-sm" htmlFor="inputDestination">Destination</label>
                            <input className="form-control form-control-sm" id="inputDestination" type="text" placeholder="Where would you like to go?" />
                        </div>
                        <div className="form-group">
                            <label className="col-form-label col-form-label-sm" htmlFor="inputTransport">Transport</label>
                            <select id="inputTransport" className="form-control form-control-sm">
                                <option defaultValue="true">On your own</option>
                                <option>Car</option>
                                <option>Bus</option>
                                <option>Plane</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="col-form-label col-form-label-sm" htmlFor="inputNumberOfPeople">Number of people</label>
                            <input className="form-control form-control-sm" id="inputNumberOfPeople" type="number" defaultValue="1" min="1" />
                            <small className="form-text text-muted">Do not include yourself</small>
                        </div>
                        <div className="form-group">
                            <label className="col-form-label col-form-label-sm" htmlFor="inputAccommodation">Accommodation</label>
                            <select id="inputAccommodation" className="form-control form-control-sm">
                                <option defaultValue="true">Provided</option>
                                <option>On your own</option>
                            </select>
                        </div>
                        <div className="row">
                            <div className="form-group col w-50">
                                <label className="col-form-label col-form-label-sm" htmlFor="inputDeparture">Date of departure</label>
                                <input id="inputDeparture" className="form-control form-control-sm" type="date"/>
                            </div>
                            <div className="form-group col w-50">
                                <label className="col-form-label col-form-label-sm" htmlFor="inputReturn">Date of return</label>
                                <input id="inputReturn" className="form-control form-control-sm" type="date"/>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="row mt-2">
                    <form className="col simple-form">
                        <div className="form-group">
                            <textarea className="form-control form-control-sm" placeholder="Description of your trip">
                            </textarea>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export {
    Trips
}