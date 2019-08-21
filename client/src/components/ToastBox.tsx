import React from 'react';
import { connect } from 'react-redux';

function ToastBox(props) {
    return (
        <div className="toast-box">
            {
                props.notifications.map(notification => {
                    return <div className="toast fade show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header">
                            <div className={`rounded-sm mr-2 bg-${notification.type} toast-icon`}></div>
                            <strong className="mr-auto">{notification.title}</strong>
                            <small className="text-muted ml-2">{notification.time}</small>
                            <button type="button" className="ml-2 mb-1 close" onClick={e => props.dismissNotification(notification)}
                                data-dismiss="toast" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="toast-body">
                            {notification.message}
                        </div>
                    </div>
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