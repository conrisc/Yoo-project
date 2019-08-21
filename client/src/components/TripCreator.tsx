import React from 'react';
import { connect } from 'react-redux';
import Debounce from 'awesome-debounce-promise';

import { TripService } from '../services';

const TOKEN = "AIzaSyBvvydrMAOa6nn4vH-HJgV_Z9Ep-v7QHfk";

// @ts-ignore
const google = window.google;

class TripCreator extends React.Component {
    readonly state;
    map;
    mapRef;
    uploadImagesInputRef;

    directionsDisplay;
    flightPath;

    updateMapDebounced;

    constructor(readonly props) {
        super(props);

        this.updateMapDebounced = Debounce(() => this.updateMap(), 800);

        this.mapRef = React.createRef();
        this.uploadImagesInputRef = React.createRef();

        this.state = {
            startingPoint: '',
            destinationPoint: '',
            transport: 'own',
            transportType: 'car',
            numberOfPeople: 1,
            accommodation: 'provided',
            startDate: '',
            endDate: '',
            tripDescrpition: '',
            transportTypeClass: 'yoo-hide',
            author: this.props.login,
            previewImages: []
        }
    }

    componentDidMount() {
        this.map = new google.maps.Map(this.mapRef.current, {
            center: {lat: 48, lng: 17},
            zoom: 4
        });
        this.directionsDisplay = new google.maps.DirectionsRenderer();

    }

    handleInputChange(event, callback = () => {}) {
        this.setState({
            [event.target.name]: event.target.value
        }, callback);
    }

    handleDirectionChange(event) {
        this.handleInputChange(event, this.updateMapDebounced);
    }

    updateMap() {
        if (this.state.startingPoint && this.state.destinationPoint) {
            this.updateGroundRoute();
            this.updateFlightRoute();
        } else if (this.state.startingPoint) {

        } else if (this.state.destinationPoint) {

        } else {

        }
    }

    updateGroundRoute() {
        const directionService = new google.maps.DirectionsService();
        directionService.route({
            origin: this.state.startingPoint,
            destination: this.state.destinationPoint,
            travelMode: 'DRIVING'
            }, (response, status) => {
                if (status === 'OK') {
                    this.directionsDisplay.setDirections(response);
                    this.directionsDisplay.setMap(this.map);
                } else {
                    this.directionsDisplay.setMap(null);
                    this.props.pushNotification({
                        title: 'Location',
                        time: 'some time ago',
                        message: 'Directions request failed',
                        type: 'danger'
                    });
                }
        });
    }

    updateFlightRoute() {
        const geocoder = new google.maps.Geocoder();

        const second = (res) => {
            geocoder.geocode({
                'address': this.state.destinationPoint
            }, (results, status) => {
                if (status === 'OK') {
                    var flightPlanCoordinates = [
                        res[0].geometry.location,
                        results[0].geometry.location
                    ];
                    this.flightPath = new google.maps.Polyline({
                        path: flightPlanCoordinates,
                        geodesic: true,
                        strokeColor: '#FF0000',
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });

                    this.flightPath.setMap(this.map);
                } else {
                    this.props.pushNotification({
                        title: 'Location',
                        time: 'some time ago',
                        message: 'Couldn\'t find second location',
                        type: 'danger'
                    });
                }
            });
        };
        geocoder.geocode({
            'address': this.state.startingPoint
        }, (results, status) => {
            if (this.flightPath) this.flightPath.setMap(null);
            if (status === 'OK') {
                second(results);
            } else {
                this.props.pushNotification({
                    title: 'Location',
                    time: 'some time ago',
                    message: 'Couldn\'t find first location',
                    type: 'danger'
                });
            }
        });
    }

    handleTransportTypeChange(event) {
        this.setState({
            transportTypeClass: event.target.value === 'provided' ? 'yoo-show' : 'yoo-hide'
        }) 
    }

    createTrip() {
        const formData = new FormData();
        const data = {
            startingPoint: this.state.startingPoint,
            destinationPoint: this.state.destinationPoint,
            transport: this.state.transport,
            transportType: this.state.transportType,
            numberOfPeople: this.state.numberOfPeople,
            accommodation: this.state.accommodation,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            description: this.state.tripDescription,
            author: this.state.author
        };
        for (const key in data) {
            formData.append(key, data[key]);
        }

        for (let i = 0; i < this.state.previewImages.length; i++) {
            formData.append(`image_${i}`, this.state.previewImages[i]);
        }

        new TripService().createTrip(formData);
    }

    showFiles() {
        const files = this.state.previewImages;
        const imgPreviewElements: JSX.Element[] = [];
        for (let i = 0; i < files.length ; i++) {
            const url = URL.createObjectURL(files[i]);
            imgPreviewElements.push(
                <div key={i} className="carousel-item h-100">
                    <img className="d-block mx-auto trip-img vertical-center" src={url}></img>
                </div>
            );
        }

        return imgPreviewElements;
    }

    uploadFiles(event) {
        const el = event.target;
        this.setState({ previewImages: el.files });
    }

    showSth() {
        return <div id="carouselExampleControls" className="carousel slide col-9 container-75vh" data-ride="carousel">
            <div className="carousel-inner bg-dark container-75vh">
                <div className="carousel-item active">
                    <div ref={this.mapRef} className="d-block w-100 container-75vh"></div>
                </div>
                {this.showFiles()}
            </div>
            <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
            </a>
        </div>;
    }

    render() {
        return (
            <div>
                <div className="row py-2">
                    {this.showSth()}
                    <form className="col simple-form">
                        <div className="form-group">
                            <label className="col-form-label col-form-label-sm" htmlFor="inputStart">Starting point</label>
                            <input className="form-control form-control-sm" id="inputStart" 
                            type="text" placeholder="What's your starting point?" name="startingPoint" onChange={e => this.handleDirectionChange(e)}/>
                        </div>
                        <div className="form-group">
                            <label className="col-form-label col-form-label-sm" htmlFor="inputDestination">Destination</label>
                            <input className="form-control form-control-sm" id="inputDestination" type="text" placeholder="Where would you like to go?"
                            name="destinationPoint" onChange={e => this.handleDirectionChange(e)} />
                        </div>
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
                        <div className="row">
                            <div className="form-group col">
                                <label htmlFor="trip-creator-upload-img" className="label-input-file btn btn-primary btn-sm">Upload images</label>
                                <input ref={this.uploadImagesInputRef} id="trip-creator-upload-img"
                                    type="file" className="input-file" onChange={e => this.uploadFiles(e)} multiple accept="image/*" />
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

const mapStateToProps = (state) => {
  return { login: state.login };
};

const mapDispatchToProps = (dispatch) => {
    return {
        pushNotification: (notification) => dispatch({ type: 'PUSH_NOTIFICATION', notification })
    };
};

// @ts-ignore
TripCreator = connect(mapStateToProps, mapDispatchToProps)(TripCreator);

export {
    TripCreator
}