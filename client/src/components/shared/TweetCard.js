import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { serverAddress } from "../../ApiHttpClient";
import {
  Card,
  CardHeader,
  Avatar,
  CardActions,
  CardContent,
  Button,
  Typography,
  CardActionArea,
} from "@material-ui/core";
import moment from 'moment';

// export default function TweetCard(props) {
//     return (
//         <p>{props.text}</p>
//     )
// }

const useStyles = makeStyles({
  root: {
    maxWidth: 445,
    marginBottom: 20,
    width: "100%",
  },
});

export default function TweetCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea
        onClick={() => window.open("/user/" + props.user.id, "_self")}
      >
        <CardHeader
          avatar={
            <Avatar
              aria-label="recipe"
              alt={props.user.firstName + " " + props.user.lastName}
              src={props.user.avatar ? serverAddress + props.user.avatar : null}
            />
          }
          title={props.user.firstName + " " + props.user.lastName}
          subheader={moment.utc(props.timestamp).local().format("DD-MM-YYYY hh:mm a")}
        />
      </CardActionArea>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {props.text}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => console.log(props.id)}
        >
          Like
        </Button>
      </CardActions>
    </Card>
  );
}
