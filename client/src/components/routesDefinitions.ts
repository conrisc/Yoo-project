import { Home } from './Home';
import { Login } from './Login';
import { Searcher } from './Searcher';
import { TripCreator } from './TripCreator';
import { Profile } from './Profile';
import { SignUp } from './SignUp';
import { Trip } from './Trip';

const routesDefinitions = [
    { path: '/', component: Home},
    { path: '/login', component: Login},
    { path: '/searcher', component: Searcher},
    { path: '/create-trip', component: TripCreator},
    { path: '/profile', component: Profile},
    { path: '/signup', component: SignUp},
    { path: '/trip/:tripId', component: Trip}
];

export {
    routesDefinitions
}
