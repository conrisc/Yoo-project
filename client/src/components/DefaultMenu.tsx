import React from 'react';
import { Link } from "react-router-dom";

class DefaultMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            <Link to='/'>Home</Link>
            <Link to='/login'>Login</Link>
        </div>
    }
}

export {
    DefaultMenu
}