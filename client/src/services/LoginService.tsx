class LoginService {
    constructor() {}

    public signIn(credentials) {
        return this.postData('http://localhost:3001/signin', credentials)
            .then(data => {
                if (data.status === 200)
                    sessionStorage.setItem('login', data.login);
                    sessionStorage.setItem('token', data.token);
                return data;
            });
    }

    public signUp(credentials) {
        return this.postData('http://localhost:3001/signup', credentials);
    }

    public signOut() {
        sessionStorage.removeItem('login');
        sessionStorage.removeItem('token');
    }

    public getUserData(credentials) {
        return this.postData('http://localhost:3001/getuserdata', credentials);
    }

    public updateUserData(credentials) {
        return this.postData('http://localhost:3001/updateuserdata', credentials);
    }

    public isLoggedIn(credentials) {
        return this.postData('http://localhost:3001/isloggedin', credentials);
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
        .then(response => response.json()); // parses JSON response into native JavaScript objects
    }
}

export {
   LoginService
}