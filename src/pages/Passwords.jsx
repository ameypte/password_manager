import React, { useState, useEffect } from "react";
import isLoggedIn from "../components/isLoggedIn";
import firebaseConfig from "../config/firebaseConfig";
import firebase from "firebase/compat/app";
import { Link } from "react-router-dom";
import "firebase/compat/database";

export default function Dashboard() {
  const isUserLoggedIn = isLoggedIn();
  const [passwords, setPasswords] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isUserLoggedIn) {
      window.location.href = "/";
      return null;
    }

    firebase.initializeApp(firebaseConfig);

    const database = firebase
      .database()
      .ref("users")
      .child(localStorage.getItem("user"))
      .child("passwords");

    database.on("value", (snapshot) => {
      const data = snapshot.val();
      const passwords = [];
      for (let id in data) {
        passwords.push({ id, ...data[id] });
      }
      setPasswords(passwords);
    });

    return () => {
      database.off();
    };
  }, [isUserLoggedIn]);

  // filter function to check if a password matches the search query based on the website or username
  const matchesSearchQuery = (password) => {
    const website = password.website.toLowerCase();
    const username = password.username.toLowerCase();
    const query = searchQuery.toLowerCase();
    return website.includes(query) || username.includes(query);
  };

  // filter the passwords based on the search query
  const filteredPasswords = passwords.filter(matchesSearchQuery);

  return (
    <div className="container my-4 px-5 py-4 rounded shadow bg-body-tertiary">
      <div className="d-flex mb-3 justify-content-between align-items-center">
        <h2 className="mb-4 col">Passwords</h2>
        <form
          className="d-flex mx-2"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-outline-success" type="submit">
            Search
          </button>
        </form>
        <Link to="/addpassword">
          <button className="btn btn-primary">Add Password</button>
        </Link>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered text-center table-hover">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>Sr. No.</th>
              <th>Website</th>
              <th>Username</th>
              <th>Password</th>
              <th>Encryption Type</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPasswords.map((password, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{password.website}</td>
                <td>{password.username}</td>
                <td>
                  <input
                    type="password"
                    className="form-control"
                    value={password.password}
                    disabled={!isUpdating || password.id !== selectedPassword}
                    onChange={(e) => {
                      const database = firebase
                        .database()
                        .ref("users")
                        .child(localStorage.getItem("user"))
                        .child("passwords");
                      database.child(password.id).update({
                        password: e.target.value,
                      });
                    }}
                  />
                </td>
                <td>{password.encryptionType}</td>
                <td>{password.lastUpdated}</td>
                <td>
                  {!isUpdating || password.id !== selectedPassword ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setIsUpdating(true);
                        setSelectedPassword(password.id);
                      }}
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        setIsUpdating(false);
                        setSelectedPassword(null);
                      }}
                    >
                      Save
                    </button>
                  )}

                  <button
                    className="btn btn-danger ms-2"
                    onClick={(e) => {
                      e.preventDefault();
                      const isConfirmed = window.confirm(
                        "Are you sure you want to delete this password?"
                      );
                      if (!isConfirmed) return;
                      const database = firebase
                        .database()
                        .ref("users")
                        .child(localStorage.getItem("user"))
                        .child("passwords");
                      database.child(password.id).remove();
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
    </div>
  );
}
