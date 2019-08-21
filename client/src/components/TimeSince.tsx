import React from 'react';
import { tsConstructorType } from '@babel/types';

class TimeSince extends React.Component {
    readonly state;
    interval;

    constructor(readonly props) {
        super(props);

        this.state = {
            timeInfo: ''
        }
    }

    componentDidMount() {
        this.updateTime();
        this.interval = setInterval(() => this.updateTime(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    updateTime() {
        const now = new Date();
        const ms = now.valueOf() - this.props.since;
        const seconds = Math.round(ms / 1000);
        const minutes = Math.floor(seconds/60);
        const info = seconds > 59 ?
            (minutes > 1 ? `${minutes} minutes ago` : `${minutes} minute ago`) :
            (seconds > 1 ? `${seconds} seconds ago` : `${seconds} second ago`);
        this.setState({ timeInfo: info });
    }

    render() {
        return <span>{this.state.timeInfo}</span>;
    }
}

export {
    TimeSince
}