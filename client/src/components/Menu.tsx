import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { DefaultMenu } from './DefaultMenu';
import { UserMenu } from './UserMenu';

class Menu extends React.Component {
    readonly state;

    constructor(props) {
        super(props);
        this.state = {
            login: ''
        }

        setInterval(() => {
            this.setState({ login: sessionStorage.getItem('login')})
            console.log(this.state.login);
        }, 2000);
    }

    render() {
        return (
        <article className="app-header">
            {this.state.login === '' ? 
                <DefaultMenu /> :
                <UserMenu />}
        </article>
        );
    }
}

export {
    Menu
}