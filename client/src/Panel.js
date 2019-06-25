import React from 'react';

class Panel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            <ul className="nav justify-content-end">
                <li className="nav-item">
                    <a className="nav-link" href="#">Szuakj podróży</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Twoje podróże</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">YourName</a>
                </li>
            </ul>
        </div>;
    }
}

export {
    Panel
};