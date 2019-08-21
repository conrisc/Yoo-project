import React from 'react';
import { connect } from 'react-redux';

import { Toast } from './Toast';

let toastId = 0;

function ToastBox(props) {
    return (
        <div className="toast-box">
            {
                props.notifications.map(notification => {
                    return <Toast key={toastId++} notification={notification} onToastDismiss={() => props.dismissNotification(notification)}/>
                })
            }
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        notifications: state.notifications
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        dismissNotification: (notification) => dispatch({ type: 'DISMISS_NOTIFICATION', notification })
    };
};

// @ts-ignore
ToastBox = connect(mapStateToProps, mapDispatchToProps)(ToastBox);

export {
    ToastBox
}