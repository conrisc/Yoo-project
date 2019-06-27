import React from 'react';
import { Home } from './Home';
import { Login } from './Login';
import { Route } from "react-router-dom";

class Content extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={Login} />
            </div>
        )
    }
}

export {
    Content
}