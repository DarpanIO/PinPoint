import React from 'react';
import {BrowserRouter as Router,Route,Routes,Navigate} from 'react-router-dom';
import Users from './user/pages/users';
import NewPlace from './places/pages/NewPlace';
function App() {
  return <Router>
  <Routes>
    <Route exact path="/" element={<Users />}></Route>
    <Route exact path="/places/new" element={<NewPlace />}></Route>
    <Route path="/*" element={ <Navigate to="/" /> } />
  </Routes>
  </Router>;
}

export default App;
