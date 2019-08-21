import React, { useState } from 'react';

function Toast(props) {
    const [visibilityClass, setVisibilityClass] = useState('show');
    const toastRef: React.RefObject<any> = React.createRef();

    function dismissNotification() {
        toastRef.current.addEventListener('transitionend', props.onToastDismiss);
        setVisibilityClass('');
    }

    return (
        <div ref={toastRef} className={`toast fade fade-slow ` + visibilityClass} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
                <div className={`rounded-sm mr-2 bg-${props.notification.type} toast-icon`}></div>
                <strong className="mr-auto">{props.notification.title}</strong>
                <small className="text-muted ml-2">{props.notification.time}</small>
                <button type="button" className="ml-2 mb-1 close" onClick={() => dismissNotification()}
                    data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="toast-body">
                {props.notification.message}
            </div>
        </div>

    );
}

export {
    Toast
}