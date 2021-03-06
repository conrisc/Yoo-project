import React from 'react';
import { connect } from 'react-redux';
import Debounce from 'awesome-debounce-promise';
import marker1 from '../map-marker_1.png';
import marker2 from '../map-marker_2.png';

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

    handleStartPointChangeDebounced
    handleDestinationPointChangeDebounced

    startMarker;
    destinationMarker;

    constructor(readonly props) {
        super(props);

        this.handleStartPointChangeDebounced = Debounce((name, value) => this.handlePointChange(name, value), 800);
        this.handleDestinationPointChangeDebounced = Debounce((name, value) => this.handlePointChange(name, value), 800);

        this.mapRef = React.createRef();
        this.uploadImagesInputRef = React.createRef();

        this.state = {
            startingPoint: { value: '', location: {}, isValid: true },
            destinationPoint: { value: '', location: {}, isValid: true },
            transport: 'own',
            transportType: 'car',
            numberOfPeople: 1,
            accommodation: 'provided',
            startDate: { value: '', isValid: true },
            endDate: { value: '', isValid: true },
            tripDescription: { value: '', isValid: true },
            transportTypeClass: 'yoo-hide',
            author: this.props.login,
            previewImages: [],
            participants: [],
            distance: { text: '-', value: 0 },
            duration: { text: '-', value: 0 },
        }

    }

    componentDidMount() {
        this.map = new google.maps.Map(this.mapRef.current, {
            center: {lat: 48, lng: 17},
            zoom: 4,
            mapTypeControl: false,
            streetViewControl: false
        });
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.startMarker = new google.maps.Marker({
            icon: marker2
        });
        this.destinationMarker = new google.maps.Marker({
            icon: marker1
        });
        this.flightPath = new google.maps.Polyline({
            geodesic: false,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        this.map.addListener('click', (e) => {
            const placeMarker = (latLng) => {
                this.startMarker.setPosition(latLng);
                this.startMarker.setMap(this.map);
            }
            placeMarker(e.latLng);
            this.geocodeLatLng(e.latLng, 'startingPoint');
        });

        this.map.addListener('rightclick', (e) => {
            const placeMarker = (latLng) => {
                this.destinationMarker.setPosition(latLng);
                this.destinationMarker.setMap(this.map);
            }
            placeMarker(e.latLng);
            this.geocodeLatLng(e.latLng, 'destinationPoint');
        });
    }

    geocodeLatLng(latlng, point) {
        const geocoder = new google.maps.Geocoder;
        geocoder.geocode({'location': latlng}, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    this.setState({ [point]: { 
                        value: results[0].formatted_address.split(',')[0],
                        location: latlng,
                        isValid: this.state[point].isValid
                    } }, () => this.updateMap());
                } else {
                    this.props.pushNotification({
                        title: 'Geocoder',
                        time: new Date(),
                        message: 'Unknown location',
                        type: 'danger'
                    });
                }
            } else {
                this.props.pushNotification({
                    title: 'Geocoder',
                    time: new Date(),
                    message: status,
                    type: 'danger'
                });
            }
        });
    }

    handleInputChange(event, callback = () => {}) {
        this.setState({
            [event.target.name]: event.target.value
        }, callback);
    }

    handleValueChange(event, callback = () => {}) {
        const oldItem = this.state[event.target.name];
        this.setState({
            [event.target.name]: { ...oldItem, value: event.target.value }
        }, callback);
    }

    handleStartPointChange(event) {
        const { name, value } = event.target;
        this.setState({ startingPoint: { value, location: this.state.startingPoint.location, isValid: this.state.startingPoint.isValid } })
        this.handleStartPointChangeDebounced(name, value);
    }

    handleDestinationPointChange(event) {
        const { name, value } = event.target;
        this.setState({ destinationPoint: { value, location: this.state.destinationPoint.location, isValid: this.state.destinationPoint.isValid } })
        this.handleDestinationPointChangeDebounced(name, value);
    }

    handlePointChange(name, value) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': value
        }, (results, status) => {
            if (this.flightPath) this.flightPath.setMap(null);
            if (status === 'OK') {
                const latLng = results[0].geometry.location;
                if (name === 'startingPoint') {
                    this.setState({ startingPoint: { value, location: latLng, isValid: this.state.startingPoint.isValid} });
                    this.startMarker.setPosition(latLng);
                    this.startMarker.setMap(this.map);
                }
                if (name === 'destinationPoint') {
                    this.setState({ destinationPoint: { value, location: latLng, isValid: this.state.destinationPoint.isValid} });
                    this.destinationMarker.setPosition(latLng);
                    this.destinationMarker.setMap(this.map);
                }
                this.updateMap();
            } else {
                this.props.pushNotification({
                    title: 'Location',
                    time: new Date(),
                    message: `Couldn\'t find ${name} location`,
                    type: 'danger'
                });
            }
        });
    }

    updateMap() {
        if (this.state.startingPoint.value && this.state.destinationPoint.value) {
            this.updateGroundRoute();
            this.updateFlightRoute();
        } 
    }

    updateGroundRoute() {
        const directionService = new google.maps.DirectionsService();
        const distanceService = new google.maps.DistanceMatrixService();
        directionService.route({
            origin: this.state.startingPoint.location,
            destination: this.state.destinationPoint.location,
            travelMode: 'DRIVING'
            }, (response, status) => {
                if (status === 'OK') {
                    this.directionsDisplay.setDirections(response);
                    this.directionsDisplay.setMap(this.map);
                    this.startMarker.setMap(null);
                    this.destinationMarker.setMap(null);
                    distanceService.getDistanceMatrix( {
                        origins: [ this.state.startingPoint.location ],
                        destinations: [ this.state.destinationPoint.location ],
                        travelMode: 'DRIVING',
                    }, (response, status) => {
                        if (status === 'OK') {
                            this.setState({
                                distance: response.rows[0].elements[0].distance,
                                duration: response.rows[0].elements[0].duration
                            });
                        }
                        else {
                            this.setState({
                                distance: { text: '', value: 0 },
                                duration: { text: '', value: 0 }
                            });
                            this.props.pushNotification({
                                title: 'Distance',
                                time: new Date(),
                                message: status,
                                type: 'danger'
                            });
                        }
                    });
                } else {
                    this.setState({
                        distance: { text: '-', value: 0 },
                        duration: { text: '-', value: 0 }
                    });
                    this.startMarker.setMap(this.map);
                    this.destinationMarker.setMap(this.map);
                    this.directionsDisplay.setMap(null);
                    this.props.pushNotification({
                        title: 'Location',
                        time: new Date(),
                        message: 'Directions request failed',
                        type: 'danger'
                    });
                }
        });
    }

    updateFlightRoute() {
        let flightPlanCoordinates = [
            this.state.startingPoint.location,
            this.state.destinationPoint.location,
        ];
        this.flightPath.setPath(flightPlanCoordinates);
        this.flightPath.setMap(this.map);
    }

    handleTransportTypeChange(event) {
        this.setState({
            transportTypeClass: event.target.value === 'provided' ? 'yoo-show' : 'yoo-hide'
        }) 
    }

    createTrip() {
        if (!this.isFormValid()) return;

        const tripData = {
            startingPoint: this.state.startingPoint,
            destinationPoint: this.state.destinationPoint,
            transport: this.state.transport,
            transportType: this.state.transportType,
            numberOfPeople: this.state.numberOfPeople,
            accommodation: this.state.accommodation,
            startDate: this.state.startDate.value,
            endDate: this.state.endDate.value,
            description: this.state.tripDescription.value,
            author: this.state.author,
            images: []
        };

        const ts = new TripService();

        ts.createTrip(tripData)
            .then(response => {
                if (response.status === 201) {
                    if (this.state.previewImages.length > 0) {
                        const formData = new FormData();
                        formData.append('tripId', response.tripId)
                        for (let i = 0; i < this.state.previewImages.length; i++) {
                            formData.append(`image_${i}`, this.state.previewImages[i]);
                        }
                        ts.uploadTripImages(formData)
                            .then(() => {
                                this.props.history.push(`/trip/${response.tripId}`)
                            })
                    } else
                        this.props.history.push(`/trip/${response.tripId}`)
                }
            });
    }

    isFormValid() {
        let isValid = true;

        const newState: any = { 
            startingPoint: { ...this.state.startingPoint },
            destinationPoint: { ...this.state.destinationPoint },
            startDate: { ...this.state.startDate },
            endDate: { ...this.state.endDate },
            tripDescription: { ...this.state.tripDescription }
        }

        for (let property in newState) {
            const item = newState[property];
            item.isValid = item.value !== '';
            isValid = isValid && item.isValid;
        }

        this.setState(newState);

        return isValid;
    }

    showFiles() {
        const files = this.state.previewImages;
        const imgPreviewElements: JSX.Element[] = [];
        for (let i = 0; i < files.length ; i++) {
            const url = URL.createObjectURL(files[i]);
            imgPreviewElements.push(
                <div key={i} className="carousel-item h-100">
                    <img className="d-block trip-img center-vh" src={url}></img>
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
        return <div id="carouselExampleControls" className="carousel slide col-8">
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
            <div className="my-2 text-right">
                <span className="font-weight-light">
                    <span className="font-weight-bold">Left Mouse Click</span> - mark starting point |
                    <span className="font-weight-bold"> Right Mouse Click</span> - mark destination point
                </span>
            </div>
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
                            <input className={'form-control form-control-sm' + (this.state.startingPoint.isValid ? '' : ' is-invalid')}
                            id="inputStart" value={this.state.startingPoint.value}
                            type="text" placeholder="What's your starting point?" name="startingPoint"
                            onChange={e => this.handleStartPointChange(e)}/>
                            <div className="invalid-feedback">
                                Please provide a strting point.
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-form-label col-form-label-sm" htmlFor="inputDestination">Destination</label>
                            <input className={'form-control form-control-sm' + (this.state.destinationPoint.isValid ? '' : ' is-invalid')}
                            id="inputDestination" value={this.state.destinationPoint.value}
                            type="text" placeholder="Where would you like to go?"
                            name="destinationPoint" onChange={e => this.handleDestinationPointChange(e)} />
                            <div className="invalid-feedback">
                                Please provide a destination.
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-form-label col-form-label-sm">Transport</label><br />
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="transport" id="ownTransport" value="own"
                                checked onChange={e=> { this.handleTransportTypeChange(e); this.handleInputChange(e) }}/>
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
                                <input id="inputDeparture"
                                className={'form-control form-control-sm' + (this.state.startDate.isValid ? '' : ' is-invalid')} 
                                type="date" name="startDate" onChange={e => this.handleValueChange(e)} />
                                <div className="invalid-feedback">
                                    Please provide the date of departure.
                                </div>
                            </div>
                            <div className="form-group col w-50">
                                <label className="col-form-label col-form-label-sm" htmlFor="inputReturn">Date of return</label>
                                <input id="inputReturn"
                                className={'form-control form-control-sm' + (this.state.endDate.isValid ? '' : ' is-invalid')}
                                type="date" name="endDate" onChange={e => this.handleValueChange(e)} />
                                <div className="invalid-feedback">
                                    Please provide the date of return.
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="trip-creator-upload-img" className="label-input-file btn btn-primary btn-sm">Upload images</label>
                                <input ref={this.uploadImagesInputRef} id="trip-creator-upload-img"
                                    type="file" className="input-file" onChange={e => this.uploadFiles(e)} multiple accept="image/*" />
                            </div>
                        </div>
                        <div className="row px-3 my-1">Distance: {this.state.transportType !== 'plane' ? this.state.distance.text : '-'}</div>
                        <div className="row px-3">Predicted travel time: {this.state.transportType !== 'plane' ? this.state.duration.text : '-'}</div>
                    </form>
                </div>
                <div className="row">
                    <form className="col-8">
                        <div className="form-group">
                            <textarea className={'form-control form-control-sm' + (this.state.tripDescription.isValid ? '' : ' is-invalid')}
                            placeholder="Description of your trip" name="tripDescription" rows={5} onChange={e => this.handleValueChange(e)}>
                            </textarea>
                            <div className="invalid-feedback">
                                Please provide a trip description.
                            </div>
                        </div>
                    </form>
                    <div className="col text-center">
                        <button onClick={() => this.createTrip()} className="btn btn-primary mt-4">Create trip</button>
                    </div>
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