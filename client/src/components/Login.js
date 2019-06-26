import React from 'react';

class Login extends React.Component {
    constructor(props) {
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
        return postData('http://localhost:3001/signin', credentials)
            .then(msg => {
                if (msg.login === 'success')
                    this.props.history.push('/panel');
                else
                    this.setState({ errorMsg: 'Invalid credentials' });
            })
            .catch(err => {
                this.setState({ errorMsg: err.message });
            })

            function postData(url = '', data = {}) {
                return fetch(url, {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, cors, *same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrer: 'no-referrer', // no-referrer, *client
                    body: JSON.stringify(data), // body data type must match "Content-Type" header
                })
                .then(response => response.json()); // parses JSON response into native JavaScript objects 
            }
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