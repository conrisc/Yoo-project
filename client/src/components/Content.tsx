import React from 'react';

import { Home } from './Home';
import { Login } from './Login';
import { Searcher } from './Searcher';
import { Trips } from './Trips';
import { Profile } from './Profile';
import { SignUp } from './SignUp';
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
                <Route exact path="/searcher" component={Searcher} />
                <Route exact path="/trips" component={Trips} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/signup" component={SignUp} />
            </div>
        )
    }
}

export {
    Content
}