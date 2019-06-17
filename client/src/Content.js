import React from 'react';
import { Home } from './Home';
import { Login } from './Login';
import { BrowserRouter as Router, Route } from "react-router-dom";

class Content extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Router>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/login" component={Login} />
                </Router>
            </div>
        )
    }
}

export {
    Content
}