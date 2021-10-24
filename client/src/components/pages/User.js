import Layout from "../Layout";
import { getUserById } from "../../api/usersApi";
import { useState, useEffect } from "react";
import { Card, CardHeader, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import UserTabbedView from "./userComponents/UserTabbedView";
import "./User.css";
import { serverAddress } from "../../ApiHttpClient";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 20,
    padding: 20,
    paddingRight: 120,
    maxWidth: 445,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    height: 150,
    width: 150,
  },
}));

function UserHeader(props) {
  const classes = useStyles();
  const userData = props.data;
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar
            className={classes.avatar}
            aria-label="recipe"
            alt={userData.firstName + " " + userData.lastName}
            src={userData.avatar ? serverAddress + userData.avatar : null}
          />
        }
        title={userData.firstName + " " + userData.lastName}
        // subheader="na"
      />
    </Card>
  );
}

function User(props) {
  const userId = props.match.params.id;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const initialLoad = async () => {
    const response = await getUserById(userId);
    setUserData(response);
    setLoading(false);
  };

  useEffect(() => {
    initialLoad();
  }, []);

  return (
    <Layout
      title={
        loading
          ? "User"
          : userData == null
          ? "User"
          : "User: " + userData.firstName + " " + userData.lastName
      }
    >
      {loading ? (
        <p>page is loading...</p>
      ) : userData == null ? (
        <p>user not found</p>
      ) : (
        <div className="pageContainer" id="user-layout">
          <UserHeader data={userData} />
          <UserTabbedView userId={userId} />
        </div>
      )}
    </Layout>
  );
}

export default User;
