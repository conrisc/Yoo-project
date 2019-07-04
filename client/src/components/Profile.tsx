import React from 'react';
import { connect } from 'react-redux';

import { LoginService } from '../services';

class Profile extends React.Component {
    constructor(readonly props) {
        super(props);

        new LoginService().isLoggedIn({
            login: this.props.login,
            token: this.props.token
        }).then(data => {
            if (data.status === 200)
                console.log('Access granted!');
            else
                this.props.history.push('/');
        });
    }

    render() {
        return (
            <div>
                This is your profile
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        login: state.login,
        token: state.token
    };
};
const mapDispatchToProps = (dispatch) => {
    return {};
};

// @ts-ignore
Profile = connect(mapStateToProps, mapDispatchToProps)(Profile);

export {
    Profile
}