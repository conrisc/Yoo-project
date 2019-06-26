import React from 'react';
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
                if (data.status === 200)
                    this.props.history.push('/panel');
                else
                    this.setState({ errorMsg: 'Invalid credentials' });
            })
            .catch(err => {
                this.setState({ errorMsg: err.message });
            });
    }

    render() {
        return (
            <div>
                <h3>Sign in</h3>
                {this.state.errorMsg && <div className="alert alert-danger"><h6>{this.state.errorMsg}</h6></div>}
                <form onSubmit={(e) => this.signIn(e)} >
                    <div className="form-group">
                        <input type="text" name="login" className="form-control" placeholder="login" onChange={(e) => this.handleInputChange(e)}/>
                    </div>
                    <div className="form-group">
                        <input type="password" name="password" className="form-control" placeholder="password" onChange={(e) => this.handleInputChange(e)}/>
                    </div>
                    <input type="submit" value="Sign in" className="btn btn-primary"/>
                </form>
            </div>
        );
    }
}


export {
    Login
}