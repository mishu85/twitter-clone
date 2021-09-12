import Layout from "../Layout";
import "./Account.css";
import {
  Paper,
  Typography,
  TextField,
  Snackbar,
  IconButton,
  Button,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { postUserUpdate, getMyUserData } from "../../api/authApi";
import CloseIcon from "@material-ui/icons/Close";
import Auth from "../../auth";
import UploadAvatar from "./accountComponents/UploadAvatar";

function Account() {
  const paperStyle = {
    padding: 20,
    minWidth: 420,
    background: "#eeeefd",
    marginBottom: 80,
  };

  const rowStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  };

  const textFieldMargin = { margin: 20, background: "#e4e47731" };
  const signInStyle = {
    backgroundColor: "#0000ffaa",
    margin: "10px auto",
    fontWeight: "bold",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
  };

  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatedNewPassword, setRepeatedNewPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [snackBarOpen, setSnackBarOpen] = useState(false);

  useEffect(async () => {
    const data = await getMyUserData();
    setEmail(data.email);
    setFirstName(data.firstName);
    setLastName(data.lastName);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== repeatedNewPassword) {
      console.log("passwords not the same");
      setSnackBarOpen(true);
      return;
    }
    const response = await postUserUpdate(
      email,
      oldPassword,
      firstName,
      lastName,
      newPassword
    );
    if (response) {
      console.log("user updated!");
      console.log(response);
      let myUser = Auth.getInstance().getMyUser();
      myUser.firstName = firstName;
      myUser.lastName = lastName;
      myUser.email = email;
      Auth.getInstance().updateMyUser(myUser);
    }
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
  };

  return (
    <Layout title="Account">
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackBarOpen}
        autoHideDuration={3000}
        message="Passwords not the same!"
        onClose={handleSnackBarClose}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackBarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <div id="page-container">
        <Paper elevation={10} style={paperStyle}>
          <div style={rowStyle}>
            <UploadAvatar />
            <Typography>Hi, {Auth.getInstance().getMyUser().firstName}</Typography>
          </div>
          <form onSubmit={handleSubmit} style={formStyle}>
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
              label="Old Password"
              placeholder="Enter old password"
              type="password"
              required
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
              }}
            />
            <TextField
              style={textFieldMargin}
              label="New Password"
              placeholder="Enter new password"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
            <TextField
              style={textFieldMargin}
              label="Repeated new Password"
              placeholder="Enter new password"
              type="password"
              value={repeatedNewPassword}
              onChange={(e) => {
                setRepeatedNewPassword(e.target.value);
              }}
            />
            <Button
              style={signInStyle}
              // id = "signIn-style"
              fullWidth
              variant="contained"
              type="submit"
            >
              Save
            </Button>
          </form>
        </Paper>
      </div>
    </Layout>
  );
}

export default Account;
