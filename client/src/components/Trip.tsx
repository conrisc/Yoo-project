import React from 'react';
import { connect } from 'react-redux';


import { TripService } from '../services';
const ts = new TripService();

const ws = new WebSocket('ws://localhost:3001');

const dataTypes = {
    NEW_MESSAGE: 'new_message'
}

class Trip extends React.Component {
    readonly state;

    constructor(readonly props) {
        super(props);

        this.state = {
            trip: {},
            requests: [],
            requestResponse: '',
            isRequestPending: false,
            requestSubstantiation: '',
            message: '',
            conversation: []
        }

        ts.getTrip(this.props.match.params.tripId)
            .then(data => {
                this.setState({ trip: data.trip[0] });
            });
        ts.getRequests({ tripId: this.props.match.params.tripId })
            .then(data => {
                this.setState({ requests: data.requests })
            });
    }

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
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

    onEditorStateChange(event) {
        this.setState({ message: event.target.value });
    }

    sendMessege() {
        const data = {
            type: dataTypes.NEW_MESSAGE,
            username: this.props.login,
            message: this.state.message,
            tripId: this.props.match.params.tripId
        };
        ws.send(JSON.stringify(data));
        this.putToConversation(data);
    }

    putToConversation(data) {
        this.setState({ conversation: [...this.state.conversation, data]});
    }


    componentWillMount() {
        ws.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        ws.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            if (dataFromServer.type === dataTypes.NEW_MESSAGE) {
                this.putToConversation(dataFromServer);
            }
        };
    }

  showEditorSection = () => (
        <div>
            <div>
                {this.state.conversation.map((data, index) => {
                    return <p key={index}>{data.username}: {data.message}</p>
                })}
            </div>
            <textarea onChange={e => this.onEditorStateChange(e)}></textarea>
            <button onClick={() => this.sendMessege()}>Send</button>
        </div>
    )

    render() {
        const trip = this.state.trip;
        return (
            <div>
                <div className="modal fade" id="exampleModal"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Sign for the trip</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <h6>Number of participants: 5 (4 spots available)</h6>
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
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => this.signForTrip()}>Sign up</button>
                        </div>
                        </div>
                    </div>
                </div>
                {this.state.requestResponse && <div className="alert alert-primary" role="alert">{this.state.requestResponse}</div>}
                <div className="row">
                    <div className="col-5">
                        <div className="row mt-4">
                            <div className="col-auto">
                                <h3 className="d-inline yoo-text-1">{trip.startingPoint}</h3>
                                <p className="text-center">{trip.startDate}</p>
                            </div>
                            <div className="col text-center">
                                <svg height="50px" width="100%" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="0" y1="25" x2="100%" y2="25" stroke="#CCCCCC" strokeWidth="2" />
                                </svg>
                                <p>5 days</p>
                            </div>
                            <div className="col-auto">
                                <h3 className="d-inline yoo-text-1">{trip.destinationPoint}</h3>
                                <p className="text-center">{trip.endDate}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col"></div>
                    { this.props.login !== trip.author &&
                    <div className="col-auto">
                        <button className="btn btn-primary btn-sm m-3" data-toggle="modal" data-target="#exampleModal">Sign for the trip</button>
                    </div>}
                </div>
                <div className="row">
                    <div className="col-auto">
                        <img className="trip-img" src="https://wallpapershome.com/images/pages/pic_h/666.jpg"></img>
                    </div>
                    <div className="col-3">
                        <ul className="nav nav-tabs" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" id="details-tab" data-toggle="tab"
                                href="#details" role="tab" aria-controls="details" aria-selected="true">Details</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="chat-tab" data-toggle="tab"
                                 href="#chat" role="tab" aria-controls="chat" aria-selected="false">Chat</a>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="details"
                                role="tabpanel" aria-labelledby="details-tab">
                                Transport: {trip.transport}<br />
                                Type of transport: {trip.transportType}<br />
                                Number of people: {trip.numberOfPeople}<br />
                                Available slots: 2<br />
                                Accommodation: {trip.accommodation}<br />
                                Host: {trip.author}<br />
                            </div>
                            <div className="tab-pane fade" id="chat"
                                role="tabpanel" aria-labelledby="chat-tab">
                                    {this.showEditorSection()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
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
                                <div className="col">{req.login}</div>
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
                    <div>
                        <div className="row shadow-sm p-2 my-4 bg-light">
                            <div className="col">
                                <h5 className="m-0">Participants</h5>
                            </div>
                        </div>
                        {this.state.trip.participants && this.state.trip.participants.length > 0 ? this.state.trip.participants.map((login, index) => {
                            return <div key={index} className="row">
                                <div className="col">{login}</div>
                                <div className="col">
                                    <button className="btn btn-danger btn-sm m-1" onClick={() => this.removeParticipant(login)}>Remove</button>
                                </div>
                            </div>
                        }): <div className="row">
                            <div className="col">
                                <span>There are no participants</span>
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
const mapDispatchToProps = () => {
  return {}
};

// @ts-ignore
Trip = connect(mapStateToProps, mapDispatchToProps)(Trip);

export {
    Trip
}