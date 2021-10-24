import Layout from "../Layout";
import "./Signup.css";
// import React from 'react';
import {
  Grid,
  Paper,
  Avatar,
  rgbToHex,
  TextField,
  Checkbox,
  Typography,
  Link,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import FingerprintIcon from "@material-ui/icons/Fingerprint";
import { register } from "../../api/usersApi";
import { useState } from "react";
// import { Link } from "react-router-dom";
import Auth from "../../auth";

function Signup() {
  const centerAlignment = { align: "center" };
  const paperStyle = {
    padding: 20,
    height: 540,
    width: 280,
    background: "#eeeefd",
  };
  const avatarStyle = { backgroundColor: "#e4e477b3" };
  const textFieldMargin = { margin: 20, background: "#e4e47731" };
  const signInStyle = {
    backgroundColor: "#0000ffaa",
    margin: "10px auto",
    fontWeight: "bold",
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await register(email, password, repeatedPassword, firstName, lastName);
    if (response) {
      console.log("signed up!");
      console.log(response);
      let myUser = {
        firstName: response.user.firstName, 
        lastName: response.user.lastName, 
        email: response.user.email, 
        avatar: response.user.avatar, 
        token: response.token,
        id: response.user._id,
      } // let myUser = response; 
      Auth.getInstance().login(myUser);
      console.log("logged in!");
      console.log(response);
      window.open("/", "_self");
    }
  };

  return (
    <Layout title="Signup" noFooter={true} showLogin={false}>
      <div id="page-container">
        <Paper elevation={10} style={paperStyle}>
          <form onSubmit={handleSubmit}>
            <Grid align="center">
              <Avatar style={avatarStyle}>
                <FingerprintIcon fontStyle="large" style={{ color: "E13" }} />
              </Avatar>
              <h1 fontStyle="bold">Sign UP</h1>
            </Grid>
            <TextField
              style={textFieldMargin}
              label="Email"
              placeholder="Type email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              style={textFieldMargin}
              label="Password"
              placeholder="Enter code"
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <TextField
              style={textFieldMargin}
              label="Repeated Password"
              placeholder="Enter repeated code"
              type="password"
              required
              value={repeatedPassword}
              onChange={(e) => {
                setRepeatedPassword(e.target.value);
              }}
            />
            <TextField
              style={textFieldMargin}
              label="First Name"
              placeholder="Type first name"
              required
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <TextField
              style={textFieldMargin}
              label="Last Name"
              placeholder="Type last name"
              required
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            <Button
              style={signInStyle}
              // id = "signIn-style"
              fullWidth
              variant="contained"
              type="submit"
            >
              SIGN UP
            </Button>
            <div>
              <h4 align="center">
                If you have an account
                <br />
                <a href="./login">LOGIN</a>
              </h4>
            </div>
          </form>
        </Paper>
      </div>
    </Layout>
  );
}

export default Signup;
