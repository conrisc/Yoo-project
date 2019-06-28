import React from 'react';

import { Menu } from './Menu';

class Header extends React.Component {

    render() {
        return (
            <div className="container bg-light">
                <div className="row">
                    <div className="col col-lg-2">
                        <h1>Yoo App</h1>
                    </div>
                    <Menu />
                </div>
            </div>
        )
    }

}

export {
    Header
}