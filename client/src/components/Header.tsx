import React from 'react';

import { Menu } from './Menu';

class Header extends React.Component {

    render() {
        return (
            <div className="container bg-app-1 text-app-1 px-4 py-2">
                <div className="row">
                    <div className="col col-lg-5">
                        <h1>Yoo app</h1>
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