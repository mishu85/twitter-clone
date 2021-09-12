import Layout from "../Layout";
import "./Login.css";
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
import { postLogin, getMyUserData } from "../../api/authApi";
import { useState } from "react";
import Auth from "../../auth";
// import { Link } from "react-router-dom";

// https://www.youtube.com/watch?v=L2RnP5vhbdg  creating a login form

function Login() {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await postLogin(email, password);
    if (response) {
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
    <Layout title="Login" noFooter={true} showLogin = {false}>
      <div id="page-container">
        <Paper elevation={10} style={paperStyle}>
          <form onSubmit={handleSubmit}>
            <Grid align="center">
              <Avatar style={avatarStyle}>
                <FingerprintIcon fontStyle="large" style={{ color: "E13" }} />
              </Avatar>
              <h1 fontStyle="bold">SIGN IN</h1>
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
              helperText="Forgot password?"
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <FormControlLabel
              control={<Checkbox name="checkedB" color="primary" />}
              label="Remember password"
            />
            <Button
              style={signInStyle}
              // id = "signIn-style"
              fullWidth
              variant="contained"
              type="submit"
            >
              SIGN IN
            </Button>
            <div>
              <Typography>
                <Link href="/" style={{ fontSize: 10 }}>
                  Don't remember your password?
                </Link>
              </Typography>

              <h4 align="center">
                If you don't have an account
                <br />
                <a href="./signup">SIGN UP</a>
              </h4>
            </div>
          </form>
        </Paper>
      </div>
    </Layout>
  );
}

export default Login;
