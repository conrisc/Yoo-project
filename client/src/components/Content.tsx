import React from 'react';
import { Route } from "react-router-dom";

import { routesDefinitions } from './routesDefinitions';

class Content extends React.Component {
    constructor(readonly props) {
        super(props);
    }

    render() {
        return (
            <div className="container-fluid pt-4 content">
                {routesDefinitions.map((routeDefinition, index) => {
                    return <Route exact path={routeDefinition.path} component={routeDefinition.component} key={index} />
                })}
            </div>
        )
    }
}

export {
    Content
}