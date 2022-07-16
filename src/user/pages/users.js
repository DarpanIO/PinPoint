import React from "react";
import UsersList from "../components/UsersList";
export default function Users() {
  const USERS = [
    {
      id: 'u1',
      name: "Darpan",
      image: "https://static.dw.com/image/62450424_401.jpg",
      places: 3,
    },
  ];
  return <UsersList items={USERS} />;
}
