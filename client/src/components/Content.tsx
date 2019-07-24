import React from 'react';
import { Route } from "react-router-dom";

import { routesDefinitions } from './routesDefinitions';

class Content extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-fluid pt-4">
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