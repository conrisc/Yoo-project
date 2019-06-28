import React from 'react';
import { Link } from "react-router-dom";

class UserMenu extends React.Component {
    readonly state;

    constructor(props) {
        super(props);
        this.state = {
            login: sessionStorage.getItem('login')
        }
    }

    render() {
        return (
            <div>
                <ul className="nav justify-content-end">
                    <li className="nav-item">
                        <Link to="/searcher" className="nav-link">Find a trip</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/trips" className="nav-link">Your trips</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/profile" className="nav-link">{this.state.login}</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

export {
    UserMenu
}