import React from 'react';
import { connect } from 'react-redux';

import { LoginService } from '../services';

const ls = new LoginService();

class Profile extends React.Component {
    state;

    constructor(readonly props) {
        super(props);

        this.state = {
            name: '',
            lastName: '',
            password: '',
            confirmPassword: ''
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
                        this.setState({ name: data.name, lastName: data.lastName });
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
                name: this.state.name,
                lastName: this.state.lastName,
                password: this.state.password
            }).then(data => {
                console.log(data.msg);
            })
        else 
            console.log('Nope');
    }

    render() {
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
                    <div className="col-auto">
                        <div className="tab-content" id="v-pills-tabContent">
                            <div className="tab-pane fade show active" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                                <form className="px-5 py-4 simple-form m-auto" onSubmit={(e) => this.editProfile(e)}>
                                    <h2 className="text-center">Your profile</h2>
                                    <div className="alert alert-info" role="alert">
                                        Some message!
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="login">Login</label>
                                        <input type="text" name="login" readOnly className="form-control-plaintext" value={this.props.login}/>
                                    </div>
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
                                        <input type="text" name="name" className="form-control" value={this.state.name} onChange={(e) => this.handleInputChange(e)}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="lastname">Lastname</label>
                                        <input type="text" name="lastName" className="form-control" value={this.state.lastName} onChange={(e) => this.handleInputChange(e)}/>
                                    </div>
                                    <div className="text-center">
                                        <input type="submit" value="Edit profile" className="btn btn-primary"/>
                                    </div>
                                </form>
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
Profile = connect(mapStateToProps, mapDispatchToProps)(Profile);

export {
    Profile
}