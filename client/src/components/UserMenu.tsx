import React from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import { LoginService } from '../services';

class UserMenu extends React.Component {
    readonly state;

    constructor(readonly props) {
        super(props);
    }

    logout(event) {
        event.preventDefault();
        this.props.setLogin('');
        this.props.setToken('');
        new LoginService().signOut();
    }

    render() {
        return (
            <div>
                <ul className="nav justify-content-end">
                    <li className="nav-item">
                        <Link to="/trips" className="nav-link">Find trip</Link>
                    </li>
                    <li className="nav-item">
                        <Link to={`/trips/1/${this.props.login}`} className="nav-link">My trips</Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/create-trip' className="nav-link">Create trip</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/profile" className="nav-link">Profile</Link>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" onClick={(e) => this.logout(e)} href="#">Logout</a>
                    </li>
                </ul>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
  return { login: state.login };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setLogin: (login) => dispatch({ type: 'CHANGE_LOGIN', login }),
    setToken: (token) => dispatch({ type: 'CHANGE_TOKEN', token })
  }
};

// @ts-ignore
UserMenu = connect(mapStateToProps, mapDispatchToProps)(UserMenu);

export {
    UserMenu
}