import React from 'react';
import {BrowserRouter as Router,Route,Routes,Navigate} from 'react-router-dom';
import Users from './user/pages/users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
function App() {
  return <Router>
  <MainNavigation />
  <main>

  <Routes>
    <Route exact path="/" element={<Users />}></Route>
    <Route exact path="/:userId/places" element={<UserPlaces />}></Route>
    <Route exact path="/places/new" element={<NewPlace />}></Route>
    <Route exact path="/places/:placeId" element={<UpdatePlace/>}></Route>
    <Route exact path="/auth" element={<Auth/>}></Route>
    <Route path="/*" element={ <Navigate to="/" /> } />
  </Routes>
  </main>
  </Router>;
}

export default App;
