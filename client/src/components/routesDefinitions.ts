import { Home } from './Home';
import { Login } from './Login';
import { Trips } from './Trips';
import { TripCreator } from './TripCreator';
import { MyProfile } from './MyProfile';
import { Profile } from './Profile';
import { SignUp } from './SignUp';
import { Trip } from './Trip';

const routesDefinitions = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/trips/:pageNumber?/:author?', component: Trips },
    { path: '/trip/:tripId', component: Trip },
    { path: '/create-trip', component: TripCreator },
    { path: '/profile', component: MyProfile },
    { path: '/profile/:login', component: Profile },
    { path: '/signup', component: SignUp },
];

export {
    routesDefinitions
}
