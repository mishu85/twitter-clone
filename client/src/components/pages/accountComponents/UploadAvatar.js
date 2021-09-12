import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { putUpdateAvatar } from "../../../api/authApi";
import Auth from "../../../auth";
import {serverAddress} from "../../../ApiHttpClient";

const useStyles = makeStyles((theme) => ({
  root: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

export default function ProfileAvatar() {
  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(async () => {
    let myUser = Auth.getInstance().getMyUser();
    setFullName(myUser.firstName + " " + myUser.lastName);
    setAvatar(myUser.avatar);
  }, []);

  const classes = useStyles();

  const handleUpload = async (event) => {
    event.preventDefault();
    console.log(event.target.files[0]);
    const response = await putUpdateAvatar(event.target.files[0]);
    if (response) {
      console.log("avatar updated!");
      console.log(response);
      setAvatar(response.avatar);
      let myUser = Auth.getInstance().getMyUser();
      myUser.avatar = response.avatar;
      Auth.getInstance().updateMyUser(myUser);
    }
  };

  return (
    <div className={classes.root}>
      <input
        accept="image/*"
        className={classes.input}
        id="icon-button-file"
        type="file"
        onChange={handleUpload}
      />
      <label htmlFor="icon-button-file">
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
        >
          <Avatar
            alt={fullName}
            src={avatar ? serverAddress + avatar : null}
            className={classes.large}
          />
        </IconButton>
      </label>
    </div>
  );
}
