import React from "react";
import isLoggedIn from "../components/isLoggedIn";

export default function PassHealth() {
  const isUserLoggedIn = isLoggedIn();

  if (!isUserLoggedIn) {
    window.location.href = "/";
    return null;
  }
  return (
    <div>
      <h1>Password Health Page</h1>
    </div>
  );
}
