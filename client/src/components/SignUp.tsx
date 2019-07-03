import React from 'react';

import { LoginService } from '../services';

class SignUp extends React.Component {
    readonly state;

    constructor(props) {
        super(props);

        this.state = {
            login: '',
            password: '',
            name: '',
            lastName: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    signUp(event) {
        event.preventDefault();
        new LoginService().signUp({
            login: this.state.login,
            password: this.state.password,
            name: this.state.name,
            lastName: this.state.lastName
        }).then(data => {
            console.log(data);
        })

    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <form className="px-5" onSubmit={(e) => this.signUp(e)}>
                <h2 className="text-center">Create an account</h2>
                <div className="form-group">
                    <label htmlFor="login">Login</label>
                    <input type="text" name="login" className="form-control" placeholder="login" onChange={this.handleInputChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" className="form-control" placeholder="password" onChange={this.handleInputChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" className="form-control" placeholder="name" onChange={this.handleInputChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="lastname">Lastname</label>
                    <input type="text" name="lastName" className="form-control" placeholder="lastname" onChange={this.handleInputChange}/>
                </div>
                <div className="text-center">
                    <input type="submit" value="Sign up" className="btn btn-primary"/>
                </div>
            </form>
        );
    }
}

export {
    SignUp
}