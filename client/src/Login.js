import React from 'react';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: ''
        }
    }

    signIn(event) {
        event.preventDefault();
        return fetch('http://localhost:3001')
            .then(response => {
                return response.json();
            })
            .then(msg => {
                if (msg.login === 'success') {
                    this.props.history.push('/');
                }
                this.setState({ error: 'Invalid credentials' });
            })
            .catch(err => {
                this.setState({ error: err.message });
            })
    }

    render() {
        return (
            <div>
                <h3>Sign in</h3>
                {this.state.error && <div className="alert alert-danger"><h6>{this.state.error}</h6></div>}
                <form onSubmit={(e) => this.signIn(e)} >
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="login"/>
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" placeholder="password"/>
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