import React, { isValidElement, useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

export default function Users() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loadedUsers, setLoadedUsers] = useState(false);

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try{
        const response = await fetch("http://localhost:5000/api/users");
        const responseData = await response.json();

        if(!response.ok){
          throw new Error(responseData.message)
        }
        setLoadedUsers(responseData.users);
        setIsLoading(false);
      }
      catch(err){
        setIsLoading(false);
        setError(err.message)
      }
    };
    sendRequest();
  },[]);

  const errorHandler=()=>{
    setError(null)
  }
  return <>
  <ErrorModal error={error} onClear={errorHandler}/>
  {isLoading && <div className="center">
    <LoadingSpinner/>
  </div> }
  {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
  </>
}
