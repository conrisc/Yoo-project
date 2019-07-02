import React from 'react';

import { LoginService } from '../services';

class SignUp extends React.Component {
    readonly state;

    constructor(props) {
        super(props);

        this.state = {
            login: '',
            password: ''
        };
    }

    signUp(event) {
        event.preventDefault();
        new LoginService().signUp({
            login: this.state.login,
            password: this.state.password
        }).then(data => {
            console.log(data);
        })

    }

    onInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <form onSubmit={(e) => this.signUp(e)}>
                <input type="text" name="login" placeholder="Login" onChange={(e) => this.onInputChange(e)}/>
                <input type="text" name="password" placeholder="Password" onChange={(e) => this.onInputChange(e)}/>
                <input type="submit" value="Sign up"/>
            </form>
        );
    }
}

export {
    SignUp
}