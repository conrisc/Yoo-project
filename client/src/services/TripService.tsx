class TripService {
    constructor() {}

    public getTrips({ skip, limit, author}) {
        skip = skip >= 0 ? skip : 0;
        limit = limit >=0 ? limit : 0;
        author = author || '';
        return this.getData(`http://localhost:3001/trips/${skip}/${limit}/${author}`);
    }

    public getTrip(id) {
        return this.getData(`http://localhost:3001/trip/${id}`);
    }

    public createTrip(data) {
        return this.postData('http://localhost:3001/trip/create', data);
    }

    public uploadTripImages(data) {
        return this.postFormData('http://localhost:3001/trip/images', data);
    }

    public requestTrip(data) {
        return this.postData('http://localhost:3001/trip/request/ask', data);
    }

    public updateRequestTrip(data) {
        return this.postData('http://localhost:3001/trip/request/update', data);
    }

    public removeRequestTrip(data) {
        return this.postData('http://localhost:3001/trip/request/remove', data);
    }

    public getRequests(data) {
        return this.postData('http://localhost:3001/trip/requests', data);
    }

    public removeParticipant(data) {
        return this.postData('http://localhost:3001/trip/participant/remove', data);
    }

    private getData(url = '') {
        return fetch(url, {
            method: 'GET',
            mode: 'cors',
        })
        .then(response => response.json());
    }

    private postData(url = '', data: any = {}) {
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
        .then(response => response.json()); // parses JSON response into native JavaScript objects
    }

    private postFormData(url = '', data: any = new FormData()) {
        return fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                // 'Content-Type': contentType,
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: data, // body data type must match "Content-Type" header
        })
        .then(response => response.json()); // parses JSON response into native JavaScript objects
    }

}

export {
   TripService
}