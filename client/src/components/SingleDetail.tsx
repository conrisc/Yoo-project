import React from 'react';

function SingleDetail(props) {

    if (props.compact) 
        return (
            <div className="border-bottom my-1">
                <h6 className="m-0 pl-2 d-inline">{props.infoName}</h6>
                <span className="pr-2 float-right">{props.infoValue}</span>
            </div>
        );
    else 
        return (
            <div className="border-bottom my-2 py-2">
                <h6 className="m-0">{props.infoName}</h6>
                <span className="pl-3">{props.infoValue}</span>
            </div>
        );
}

export {
    SingleDetail
}