class TripService {
    constructor() {}

    public createTrip(data) {
        console.log(data);
        return this.postData('http://localhost:3001/trip/create', data);
    }

    private postData(url = '', data = {}) {
        return fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
        .then(response => {console.log(response); return response.json()}); // parses JSON response into native JavaScript objects
    }
}

export {
   TripService
}