import React from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";

class UserMenu extends React.Component {
    readonly state;

    constructor(props) {
        super(props);
        this.state = {
            login: sessionStorage.getItem('login')
        }
    }

    render() {
        return <Router>
            <div>
                <ul className="nav justify-content-end">
                    <li className="nav-item">
                        <a className="nav-link" href="#">Szuakj podróży</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Twoje podróże</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">{this.state.login}</a>
                    </li>
                </ul>
            </div>
        </Router>
    }
}

export {
    UserMenu
}