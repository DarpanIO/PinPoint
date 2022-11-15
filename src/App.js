import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Users from "./user/pages/users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";

let logoutTimer;


function App() {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate,setTokenExpirationDate ]= useState()
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 2000);
    setTokenExpirationDate(tokenExpirationDate)
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null)
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(()=>{
    if(token && tokenExpirationDate){
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
      logoutTimer =setTimeout(logout,remainingTime)
    }else{
      clearTimeout(logoutTimer)
    }
  },[token,logout,tokenExpirationDate])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token && new Date(storedData.expiration)>new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);
  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route exact path="/" element={<Users />}></Route>
        <Route exact path="/:userId/places" element={<UserPlaces />}></Route>
        <Route exact path="/places/new" element={<NewPlace />}></Route>
        <Route exact path="/places/:placeId" element={<UpdatePlace />}></Route>
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route exact path="/" element={<Users />}></Route>
        <Route exact path="/:userId/places" element={<UserPlaces />}></Route>
        <Route exact path="/auth" element={<Auth />}></Route>
        <Route path="/*" element={<Navigate to="/auth" />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
