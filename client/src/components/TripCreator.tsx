import React from 'react';

import { TripService } from '../services';

const TOKEN = "AIzaSyBvvydrMAOa6nn4vH-HJgV_Z9Ep-v7QHfk";

// @ts-ignore
const google = window.google;

class TripCreator extends React.Component {
    readonly state;
    map;
    mapRef;

    constructor(props) {
        super(props);

        this.mapRef = React.createRef();
        this.state = {
            startingPoint: '',
            destinationPoint: '',
            transport: 'own',
            transportType: 'car',
            numberOfPeople: 1,
            accommodation: 'own',
            startDate: '',
            endDate: '',
            tripDescrpition: '',
            transportTypeClass: 'yoo-hide'
        }
    }

    componentDidMount() {
        this.map = new google.maps.Map(this.mapRef.current, {
            center: {lat: 48, lng: 17},
            zoom: 4
        });
    }

    handleInputChange(event) {
        console.log(event.target.name, event.target.value);
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    findDirection(event) {
        event.preventDefault();

        const directionsDisplay = new google.maps.DirectionsRenderer;
        directionsDisplay.setMap(this.map);
        const directionService = new google.maps.DirectionsService;
        directionService.route({
            origin: this.state.startingPoint,
            destination: this.state.destinationPoint,
            travelMode: 'DRIVING'
            }, (response, status) => {
            console.log(response);
            console.log(response.routes[0].legs[0].end_location.lat());
            var flightPlanCoordinates = [
                {lat: response.routes[0].legs[0].start_location.lat(), lng: response.routes[0].legs[0].start_location.lng()},
                {lat: response.routes[0].legs[0].end_location.lat(), lng: response.routes[0].legs[0].end_location.lng()},
            ];
            var flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            flightPath.setMap(this.map);
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    handleTransportTypeChange(event) {
        this.setState({
            transportTypeClass: event.target.value === 'provided' ? 'yoo-show' : 'yoo-hide'
        }) 
    }

    createTrip() {
        const data = {
            startingPoint: this.state.startingPoint,
            destinationPoint: this.state.destinationPoint,
            transport: this.state.transport,
            transportType: this.state.transportType,
            numberOfPeople: this.state.numberOfPeople,
            accommodation: this.state.accommodation,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            tripDescrpition: this.state.tripDescription

        };
        new TripService().createTrip(data);
    }

    render() {
        return (
            <div>
                <div className="row py-2">
                    <div ref={this.mapRef} className="col-9 container-75vh"></div>
                    <form className="col simple-form">
                        <div className="form-group">
                            <label className="col-form-label col-form-label-sm" htmlFor="inputStart">Starting point</label>
                            <input className="form-control form-control-sm" id="inputStart" 
                            type="text" placeholder="What's your starting point?" name="startingPoint" onChange={e => this.handleInputChange(e)}/>
                        </div>
                        <div className="form-group">
                            <label className="col-form-label col-form-label-sm" htmlFor="inputDestination">Destination</label>
                            <input className="form-control form-control-sm" id="inputDestination" type="text" placeholder="Where would you like to go?"
                            name="destinationPoint" onChange={e => this.handleInputChange(e)} />
                        </div>
                        <button onClick={e => this.findDirection(e)}>Find</button>
                        <div className="form-group">
                            <label className="col-form-label col-form-label-sm">Transport</label><br />
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="transport" id="ownTransport" value="own"
                                onChange={e=> { this.handleTransportTypeChange(e); this.handleInputChange(e) }}/>
                                <label className="form-check-label col-form-label-sm" htmlFor="ownTransport">Everyone on its own</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="transport" id="providedTransport" value="provided"
                                onChange={e=> { this.handleTransportTypeChange(e); this.handleInputChange(e)}}/>
                                <label className="form-check-label col-form-label-sm" htmlFor="providedTransport">Transport provided</label>
                            </div>
                        </div>
                        <div className={'form-group ' + this.state.transportTypeClass}>
                            <label className="col-form-label col-form-label-sm" htmlFor="selectTransportType">Type of transport</label>
                            <select id="selectTransportType" className="form-control form-control-sm" name="transportType" value={this.state.transportType}
                                onChange={e => this.handleInputChange(e)}>
                                <option value="car">Car</option>
                                <option value="bus">Bus</option>
                                <option value="plane">Plane</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="col-form-label col-form-label-sm" htmlFor="inputNumberOfPeople">Number of people</label>
                            <input className="form-control form-control-sm" id="inputNumberOfPeople" type="number"
                            value={this.state.numberOfPeople} name="numberOfPeople" min="1" max="20" onChange={e => this.handleInputChange(e)}/>
                            <small className="form-text text-muted">Do not include yourself</small>
                        </div>
                        <div className="form-group">
                            <label className="col-form-label col-form-label-sm" htmlFor="inputAccommodation">Accommodation</label>
                            <select id="inputAccommodation" className="form-control form-control-sm" name="accommodation" onChange={e => this.handleInputChange(e)}>
                                <option value="provided">Provided</option>
                                <option value="own">On your own</option>
                            </select>
                        </div>
                        <div className="row">
                            <div className="form-group col w-50">
                                <label className="col-form-label col-form-label-sm" htmlFor="inputDeparture">Date of departure</label>
                                <input id="inputDeparture" className="form-control form-control-sm" type="date" name="startDate" onChange={e => this.handleInputChange(e)} />
                            </div>
                            <div className="form-group col w-50">
                                <label className="col-form-label col-form-label-sm" htmlFor="inputReturn">Date of return</label>
                                <input id="inputReturn" className="form-control form-control-sm" type="date" name="endDate" onChange={e => this.handleInputChange(e)} />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="row mt-2 container">
                    <form className="col simple-form">
                        <div className="form-group">
                            <textarea className="form-control form-control-sm" placeholder="Description of your trip" name="tripDescription"
                                onChange={e => this.handleInputChange(e)}>
                            </textarea>
                        </div>
                    </form>
                </div>
                <div className="my-3 text-center footer">
                    <button onClick={() => this.createTrip()} className="btn btn-primary">Create trip</button>
                </div>
            </div>
        );
    }
}

export {
    TripCreator
}