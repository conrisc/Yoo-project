import React from 'react';

class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    alert() {
        alert("lol");
    }

    render() {
        return (
            <div>
                <h3>Sign in</h3>
                <form onSubmit={this.alert} >
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="login"/>
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-control" placeholder="password"/>
                    </div>
                    <input type="submit" value="Sign in" class="btn btn-primary"/>
                </form>
            </div>
        );
    }
}


export {
    Login
}