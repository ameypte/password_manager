import React, { useEffect } from "react";
import isLoggedIn from "../components/isLoggedIn";

export default function PassGene() {
  useEffect(() => {
    const isUserLoggedIn = isLoggedIn();

    if (!isUserLoggedIn) {
      window.location.href = "/";
      return null;
    }
  });
  return (
    <div>
      <h1>Password Generator Page</h1>
    </div>
  );
}
