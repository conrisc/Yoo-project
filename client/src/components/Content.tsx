import React from 'react';
import { Home } from './Home';
import { Login } from './Login';
import { Panel } from './Panel';
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
                    <Route exact path="/panel" component={Panel} />
                </Router>
            </div>
        )
    }
}

export {
    Content
}