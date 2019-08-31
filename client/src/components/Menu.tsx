import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { DefaultMenu } from './DefaultMenu';
import { UserMenu } from './UserMenu';

class Menu extends React.Component {
    readonly state;

    constructor(readonly props) {
        super(props);
    }

    render() {
        return (
            <div className="col text-right">
                {this.props.login === '' ?
                    <div>
                        <DefaultMenu />
                        <Redirect to="/login" />
                    </div> :
                    <UserMenu />}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { login: state.login };
};
const mapDispatchToProps = (dispatch) => {
    return {}
};

// @ts-ignore
Menu = connect(mapStateToProps, mapDispatchToProps)(Menu);

export {
    Menu
}