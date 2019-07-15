import React from 'react';

// @ts-ignore
const google = window.google;

class Trips extends React.Component {

    initMap() {
    }

    componentDidMount() {
        let map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
        });
    }

    render() {
        return (
            <div>
                <div id="map"></div>
            </div>
        );
    }
}

export {
    Trips
}