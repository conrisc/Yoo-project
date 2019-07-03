import React from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

class UserMenu extends React.Component {
    readonly state;

    constructor(readonly props) {
        super(props);
    }

    logout(event) {
        event.preventDefault();
        this.props.setLogin('');
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
                        <Link to="/profile" className="nav-link">{this.props.login}</Link>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" onClick={(e) => this.logout(e)} href="">Logout</a>
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
    setLogin: (login) => dispatch({ type: 'CHANGE_LOGIN', newLogin: login }),
  }
};

// @ts-ignore
UserMenu = connect(mapStateToProps, mapDispatchToProps)(UserMenu);

export {
    UserMenu
}