import React from 'react';
import { connect } from 'react-redux';

import { LoginService } from '../services';

const ls = new LoginService();

class MyProfile extends React.Component {
    state;

    constructor(readonly props) {
        super(props);

        this.state = {
            avatar: '',
            name: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            description: '',
            infoBox: {
                msg: '',
                type: 'info'
            }
        }

        ls.isLoggedIn({
            login: this.props.login,
            token: this.props.token
        }).then(data => {
            if (data.status === 200) {
                console.log('Access granted!');
                ls.getUserData({
                    login: this.props.login
                }).then(data => {
                    if (data.status === 200) {
                        this.setState({ 
                            name: data.name,
                            lastName: data.lastName,
                            avatar: data.avatar,
                            description: data.description
                        });
                    }
                });
            }
            else
                this.props.history.push('/');
        });
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    editProfile(event) {
        event.preventDefault();
        if (this.state.password === this.state.confirmPassword)
            ls.updateUserData({
                login: this.props.login,
                password: this.state.password,
                name: this.state.name,
                lastName: this.state.lastName,
                description: this.state.description
            }).then(data => {
                this.setState({
                    infoBox: {
                        message: data.msg,
                        type: data.status === 200 ? 'primary' : 'danger'
                    }
                });
            })
        else 
            this.setState({
                infoBox: {
                    message: 'Passwords do not match!',
                    type: 'danger'
                }
            });
    }

    render() {
        const defaultAvatar = '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';
        const avatar = this.state.avatar || defaultAvatar;
        return (
            <div>
                <div className="row">
                    <div className="col-2">
                        <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                            <a className="nav-link active" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="true">Profile</a>
                            <a className="nav-link" id="v-pills-messages-tab" data-toggle="pill" href="#v-pills-messages" role="tab" aria-controls="v-pills-messages" aria-selected="false">Messages</a>
                            <a className="nav-link" id="v-pills-settings-tab" data-toggle="pill" href="#v-pills-settings" role="tab" aria-controls="v-pills-settings" aria-selected="false">Settings</a>
                        </div>
                    </div>
                    <div className="col">
                        <div className="tab-content" id="v-pills-tabContent">
                            <div className="tab-pane fade show active" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                                <div className="px-5 py-4">
                                    <div className="row my-3">
                                        <div className="col">
                                            <div className="d-inline-block">
                                                <img className="avatar-l" src={`data:image/png;base64, ${avatar}`} />
                                            </div>
                                            <h3 className="d-inline-block ml-3">{this.props.login}</h3>
                                        </div>
                                        {this.state.infoBox.message && 
                                            <div className="col-auto">
                                                <div className={`alert alert-${this.state.infoBox.type} m-4`} role="alert">
                                                    {this.state.infoBox.message}
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <form onSubmit={(e) => this.editProfile(e)}>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-group">
                                                    <label htmlFor="password">New Password</label>
                                                    <input type="password" name="password" className="form-control" placeholder="password" onChange={(e) => this.handleInputChange(e)}/>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="password">Confirm Password</label>
                                                    <input type="password" name="confirmPassword" className="form-control" placeholder="password" onChange={(e) => this.handleInputChange(e)}/>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="name">Name</label>
                                                    <input type="text" name="name" className="form-control fomr=control=sm" value={this.state.name} onChange={(e) => this.handleInputChange(e)}/>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="lastname">Lastname</label>
                                                    <input type="text" name="lastName" className="form-control" value={this.state.lastName} onChange={(e) => this.handleInputChange(e)}/>
                                                </div>
                                                <div className="text-center">
                                                    <input type="submit" value="Edit profile" className="btn btn-primary"/>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="description">Description</label>
                                                    <textarea rows={8} name="description" className="form-control" value={this.state.description}
                                                    onChange={(e) => this.handleInputChange(e)}/>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab">3</div>
                            <div className="tab-pane fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab">4</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        login: state.login,
        token: state.token
    };
};
const mapDispatchToProps = (dispatch) => {
    return {};
};

// @ts-ignore
MyProfile = connect(mapStateToProps, mapDispatchToProps)(MyProfile);

export {
    MyProfile
}