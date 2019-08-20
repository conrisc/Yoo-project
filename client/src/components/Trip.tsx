import React from 'react';
import { connect } from 'react-redux';


import { TripService } from '../services';
const ts = new TripService();


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
        <div className="">
            <div className="m-2 font-weight-light overflow-auto conversation-box">
                {this.state.conversation.length > 0 ?
                    this.state.conversation.map((data, index) => {
                        const formatedTime = this.getFormatedDate(new Date(data.date));
                        return <span className="d-block" key={index}>{formatedTime} <span className="font-weight-bold">{data.username}</span>: {data.message}</span>
                    })
                    :
                    <span className="text-primary">This chat is empty</span>
                }
            </div>
            <div className="form-group mt-2">
                <textarea
                    ref={this.messageBoxRef}
                    className="form-control"
                    rows={2}
                    onKeyDown={e => this.handleKeyPressed(e)}
                    onChange={e => this.handleMessageBoxChange(e)}>
                </textarea>
            </div>
            <button className="btn btn-primary" onClick={() => this.sendMessege()} disabled={this.state.isMessageBoxEmpty}>Send</button>
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
                    <div className="col-8">
                        <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner bg-dark container-75vh">
                            <div className="carousel-item active">
                            </div>
                            {
                                trip.images && trip.images.map((imageBase64, index) => {
                                    return <div key={index} className="carousel-item h-100">
                                        <img src={`data:image/jpg;base64, ${imageBase64}`} className="d-block mx-auto trip-img vertical-center" />
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
                                    {this.showChatBox()}
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