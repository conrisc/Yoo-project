import React from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";

class Menu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Router>
            <Link to='/'>Home</Link>
            <Link to='/login'>Login</Link>
        </Router>
    }
}

export {
    Menu
}