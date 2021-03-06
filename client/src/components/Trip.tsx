import React from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import { SingleDetail } from './SingleDetail';
import { TripService } from '../services';

const ts = new TripService();

// @ts-ignore
const google = window.google;

const dataTypes = {
    NEW_MESSAGE: 'new_message',
    JOIN_CHAT: 'join_chat'
}

const keys = {
    ENTER: 'Enter'
}

class Trip extends React.Component {
    readonly state;
    ws: WebSocket;
    messageBoxRef: React.RefObject<any>;
    map;
    mapRef: React.RefObject<any>;
    directionsDisplay;
    flightPath;

    constructor(readonly props) {
        super(props);

        this.state = {
            trip: {},
            requests: [],
            requestResponse: '',
            isRequestPending: false,
            requestSubstantiation: '',
            conversation: [],
            isMessageBoxEmpty: true
        }

        this.ws = new WebSocket('ws://localhost:3001');
        this.messageBoxRef = React.createRef();
        this.mapRef = React.createRef();

        ts.getTrip(this.props.match.params.tripId)
            .then(data => {
                if (data.status === 200)
                    this.setState({ trip: data.trip }, () => this.updateMap());
            });
        ts.getRequests({ tripId: this.props.match.params.tripId })
            .then(data => {
                this.setState({ requests: data.requests })
            });
    }

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    updateMap() {
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        if (this.state.trip.startingPoint.value && this.state.trip.destinationPoint.value) {
            if (this.state.trip.transportType !== 'plane') this.setGroundRoute();
            else this.setFlightRoute();
        } 
    }

    setGroundRoute() {
        const directionService = new google.maps.DirectionsService();
        directionService.route({
            origin: this.state.trip.startingPoint.location,
            destination: this.state.trip.destinationPoint.location,
            travelMode: 'DRIVING'
            }, (response, status) => {
                if (status === 'OK') {
                    this.directionsDisplay.setDirections(response);
                    this.directionsDisplay.setMap(this.map);
                } else {
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

    setFlightRoute() {
        var flightPlanCoordinates = [
            this.state.trip.startingPoint.location,
            this.state.trip.destinationPoint.location
        ];
        this.flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        this.flightPath.setMap(this.map);
    }

    signForTrip() {
        const data = {
            login: this.props.login,
            tripId: this.state.trip._id,
            requestSubstantiation: this.state.requestSubstantiation
        }
        ts.requestTrip(data)
            .then(data => {
                this.setState({
                    requestResponse: data.msg,
                    isRequestPending: data.isRequestPending
                });
            })
    }

    approveRequest(requestId) {
        ts.updateRequestTrip({requestId, status: 'approved'});
    }

    rejectRequest(requestId) {
        ts.updateRequestTrip({requestId, status: 'rejected'});
    }

    removeParticipant(login) {
        ts.removeParticipant({tripId: this.state.trip._id, login});
    }

    sendMessege() {
        const messageBox = this.messageBoxRef.current;
        if (messageBox.value !== '') {
            const data = {
                type: dataTypes.NEW_MESSAGE,
                username: this.props.login,
                message: messageBox.value,
                date: Date(),
                tripId: this.props.match.params.tripId
            };
            this.ws.send(JSON.stringify(data));
            this.putToConversation(data);
            this.clearMessageBox();
        }
    }

    clearMessageBox() {
        if (this.messageBoxRef.current !== null)
            this.messageBoxRef.current.value = '';

        this.setState({ isMessageBoxEmpty: true });
    }

    putToConversation(data) {
        this.setState({ conversation: [...this.state.conversation, data]});
    }


    componentWillMount() {
        this.ws.onopen = () => {
            console.log('WebSocket Client Connected');
            const data = {
                type: dataTypes.JOIN_CHAT,
                username: this.props.login,
                tripId: this.props.match.params.tripId
            }
            this.ws.send(JSON.stringify(data));
        };
        this.ws.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            if (dataFromServer.type === dataTypes.NEW_MESSAGE &&
                dataFromServer.tripId === this.props.match.params.tripId) {
                this.putToConversation(dataFromServer);
            }
        };
    }

    componentDidMount() {
        this.map = new google.maps.Map(this.mapRef.current, {
            center: {lat: 48, lng: 17},
            zoom: 4
        });
    }

    handleKeyPressed(event) {
        if (event.key === keys.ENTER) {
            event.preventDefault();
            this.sendMessege();
        }
    }

    handleMessageBoxChange(event) {
        const isMessageBoxEmpty = event.target.value  === '';
        if (this.state.isMessageBoxEmpty !== isMessageBoxEmpty)
            this.setState({ isMessageBoxEmpty });
    }

    showChatBox = () => (
        <div>
            <div className="m-2 font-weight-light overflow-auto conversation-box">
                {this.state.conversation.length > 0 ?
                    this.state.conversation.map((data, index) => {
                        const formatedTime = this.getFormatedDate(new Date(data.date));
                        return <span className="d-block" key={index}>
                            <span>{formatedTime}&nbsp;</span>
                            <Link to={`/profile/${data.username}`} className="font-weight-bold text-decoration-none">{data.username}</Link>
                            <span>: {data.message}</span>
                        </span>
                    })
                    :
                    <span className="text-primary">This chat is empty</span>
                }
            </div>
            <div className="form-group m-2">
                <div className="row">
                    <div className="col">
                        <textarea
                            ref={this.messageBoxRef}
                            className="form-control"
                            rows={2}
                            onKeyDown={e => this.handleKeyPressed(e)}
                            onChange={e => this.handleMessageBoxChange(e)}>
                        </textarea>
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-primary btn-sm mt-3" onClick={() => this.sendMessege()} disabled={this.state.isMessageBoxEmpty}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )

    getFormatedDate(fullDate: Date) {
        const date = [fullDate.getDate(), fullDate.getMonth()+1, fullDate.getFullYear()];
        const time = [fullDate.getHours(), fullDate.getMinutes()].map(el => {
            return ('0' + el).slice(-2);
        });

        return date.join('.') + ' ' + time.join(':');
    }

    getDisabledClass() {
        const trip = this.state.trip;
        return trip.author === this.props.login ||
            (trip.participants && trip.participants.find(el => el === this.props.login)) ?
            '' : 'disabled';
    }

    shouldDisplayRequestAction() {
        const trip = this.state.trip;
        return this.props.login !== trip.author;
    }

    showParticipantsList() {
        const trip = this.state.trip
        return (
            <div>
                {trip.participants && trip.participants.length > 0 ? trip.participants.map((login, index) => {
                    return <div key={index} className="row border-bottom mx-2 py-2">
                        <div className="col">
                            <Link to={`/profile/${login}`} className="text-decoration-none">{login}</Link>
                        </div>
                        {trip.author === this.props.login && <div className="col">
                            <button className="btn btn-link btn-sm text-decoration-none text-danger p-0 align-top" onClick={() => this.removeParticipant(login)}>Remove</button>
                        </div>}
                    </div>
                })
                :
                <span>There are no participants</span>
                }
            </div>
        );
    }

    getRequestAction() {
        const trip = this.state.trip;
        const myRequest = this.state.requests.find(el => el.login === this.props.login);
        const availableSpots = trip.numberOfPeople - (trip.participants ? trip.participants.length : 0);

        if (trip.participants && trip.participants.find(el => el === this.props.login))
            return <button className="btn btn-success btn-sm m-3" disabled>You are signed up for this trip</button>;
        else if (availableSpots === 0)
            return <button className="btn btn-danger btn-sm m-3" disabled>There are no available spots</button>;
        else if (!myRequest)
            return <button className="btn btn-primary btn-sm m-3" data-toggle="modal" data-target="#exampleModal">Sign up for the trip</button>;
        else if (myRequest.status === 'pending')
            return <button className="btn btn-warning btn-sm m-3" disabled>Your request is pending</button>;
        else 
            return <button className="btn btn-danger btn-sm m-3" disabled>Your request has been rejected</button>;
    }

    render() {
            return this.renderTrip();
    }

    renderError() {
        return <div>
            <h4>Trip not found</h4>
        </div>
    }

    renderTrip() {
        const trip = this.state.trip;
        const availableSpots = trip.numberOfPeople - (trip.participants ? trip.participants.length : 0);
        const tripDuration = (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24);
        return (
            <div>
                <div className="modal fade" id="exampleModal"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Sign up for the trip</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <h6>Number of participants: {trip.numberOfPeople} ({availableSpots} spots available)</h6>
                            </div>
                            <form className="simple-form">
                                <div className="form-group">
                                    <label className="col-form-label col-form-label-sm" htmlFor="requestSubstantiation">Why do you want to participate in this trip?</label>
                                    <textarea id="requestSubstantation" name="requestSubstantiation" className="form-control form-control-sm" onChange={e => this.handleInputChange(e) }
                                        placeholder="What would you like to do, to see, to visit? Maybe write a few words about yourself">
                                    </textarea>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => this.signForTrip()} data-dismiss="modal">Sign up</button>
                        </div>
                        </div>
                    </div>
                </div>
                {this.state.requestResponse && <div className="alert alert-primary" role="alert">{this.state.requestResponse}</div>}
                <div className="row">
                    <div className="col-8 px-5">
                        <div className="row mt-4">
                            <div className="col-auto">
                                {trip.startingPoint && <h3 className="d-inline yoo-text-1">{trip.startingPoint.value}</h3> }
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
                    <div className="col"></div>
                    { this.shouldDisplayRequestAction() &&
                    <div className="col-auto">
                        {this.getRequestAction()}
                    </div>}
                </div>
                <div className="row">
                    <div className="col-8">
                        <div id="carouselExampleControls" className="carousel slide">
                        <div className="carousel-inner bg-dark container-75vh">
                            <div className="carousel-item active">
                                <div ref={this.mapRef} className="d-block w-100 container-75vh"></div>
                            </div>
                            {
                                trip.images && trip.images.map((imageBase64, index) => {
                                    return <div key={index} className="carousel-item h-100">
                                        <img src={`data:image/jpg;base64, ${imageBase64}`} className="d-block trip-img center-vh" />
                                    </div>;
                                })
                            }
                        </div>
                        <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                        </div>
                    </div>
                    <div className="col-4">
                        <ul className="nav nav-tabs" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" id="details-tab" data-toggle="tab"
                                href="#details" role="tab" aria-controls="details" aria-selected="true">Details</a>
                            </li>
                            <li className="nav-item">
                                <a className={'nav-link ' + this.getDisabledClass() } id="chat-tab" data-toggle="tab"
                                 href="#chat" role="tab" aria-controls="chat" aria-selected="false">Chat</a>
                            </li>
                            <li className="nav-item">
                                <a className={'nav-link ' + this.getDisabledClass() } id="chat-tab" data-toggle="tab"
                                 href="#participants" role="tab" aria-controls="chat" aria-selected="false">Participants</a>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="details"
                                role="tabpanel" aria-labelledby="details-tab">
                                <SingleDetail infoName="Transport" infoValue={trip.transport} />
                                <SingleDetail infoName="Type of transport" infoValue={trip.transport !== 'own' ? trip.transportType : '-'} />
                                <SingleDetail infoName="Number of people" infoValue={trip.numberOfPeople} />
                                <SingleDetail infoName="Available spots" infoValue={availableSpots} />
                                <SingleDetail infoName="Accommodation" infoValue={trip.accommodation} />
                                <SingleDetail infoName="Author" infoValue={<Link to={`/profile/${trip.author}`} className="text-decoration-none">{trip.author}</Link>} />
                            </div>
                            <div className="tab-pane fade" id="chat"
                                role="tabpanel" aria-labelledby="chat-tab">
                                    {this.showChatBox()}
                            </div>
                            <div className="tab-pane fade" id="participants"
                                role="tabpanel" aria-labelledby="participants-tab">
                                    {this.showParticipantsList()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col my-4">
                        <h6>Trip description</h6>
                        {trip.description}
                    </div>
                </div>
                { this.props.login === trip.author &&
                <div className="m-2">
                    <div>
                        <div className="row shadow-sm p-2 my-4 bg-light">
                            <div className="col">
                                <h5 className="m-0">Pending requests</h5>
                            </div>
                        </div>
                        {this.state.requests.length > 0 ? this.state.requests.map((req, index) => {
                            return <div key={index} className="row">
                                <div className="col">
                                    <Link to={`/profile/${req.login}`} className="text-decoration-none">{req.login}</Link>
                                </div>
                                <div className="col">{req.requestSubstantiation}</div>
                                <div className="col">
                                    <button className="btn btn-danger btn-sm m-1" onClick={() => this.rejectRequest(req._id)}>Reject</button>
                                    <button className="btn btn-primary btn-sm m-1" onClick={() => this.approveRequest(req._id)}>Accept</button>
                                </div>
                                <div className="col">
                                    <span>{req.status}</span>
                                </div>
                            </div>
                        }): <div className="row">
                            <div className="col">
                                <span>There are no pending requests</span>
                            </div>
                        </div>}
                    </div>
                </div>}
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
    }
};

// @ts-ignore
Trip = connect(mapStateToProps, mapDispatchToProps)(Trip);

export {
    Trip
}