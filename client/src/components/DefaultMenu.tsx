import React from 'react';
import { Link } from "react-router-dom";

class DefaultMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
                <ul className="nav justify-content-end">
                    <li className="nav-item">
                        <Link to='/' className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/login' className="nav-link">Login</Link>
                    </li>
                </ul>
        </div>
    }
}

export {
    DefaultMenu
}