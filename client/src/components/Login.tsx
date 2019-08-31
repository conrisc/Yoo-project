import React from 'react';
import { connect } from 'react-redux';

import { LoginService } from '../services';

class Login extends React.Component {
    readonly state;

    constructor(readonly props) {
        super(props);

        this.state = {
            errorMsg: '',
            login: '',
            password: ''
        }
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    signIn(event) {
        event.preventDefault();
        const credentials = {
            login: this.state.login,
            password: this.state.password
        }

        new LoginService().signIn(credentials)
            .then(data => {
                if (data.status === 200) {
                    this.props.setLogin(data.login);
                    this.props.setToken(data.token);
                    this.props.history.push('/profile');
                }
                else
                    this.setState({ errorMsg: 'Invalid credentials' });
            })
            .catch(err => {
                this.setState({ errorMsg: err.message });
            });
    }

    render() {
        return (
            <form className="px-5 py-4 simple-form m-auto text-center" onSubmit={(e) => this.signIn(e)} >
                <h5 className="mb-5">Just sign in and enjoy making new friends to travel with.</h5>
                <h2>Sign in</h2>
                {this.state.errorMsg && <div className="alert alert-danger"><h6>{this.state.errorMsg}</h6></div>}
                <div className="form-group text-left">
                    <label htmlFor="login">Login</label>
                    <input type="text" name="login" className="form-control" placeholder="login" onChange={(e) => this.handleInputChange(e)}/>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" className="form-control" placeholder="password" onChange={(e) => this.handleInputChange(e)}/>
                </div>
                <div>
                    <input type="submit" value="Sign in" className="btn btn-primary"/>
                </div>
            </form>
        );
    }
}


const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {
    setLogin: (login) => dispatch({ type: 'CHANGE_LOGIN', login }),
    setToken: (token) => dispatch({ type: 'CHANGE_TOKEN', token }),
  };
};

// @ts-ignore
Login = connect(mapStateToProps, mapDispatchToProps)(Login);

export {
    Login
}