import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { postTweet } from "../../../api/tweetsApi";

const useStyles = makeStyles({
  root: {
    maxWidth: 445,
    marginBottom: 20,
    width: "100%",
  },
  textarea: {
      width: "100%",
      resize: "none",
      minHeight: 80
  }
});

export default function PostTweetCard(props) {
  const classes = useStyles();
  const onPostCallback = props.onPost;
  const [text, setText] = useState("");

  const handlePost = async () => {
    var bodyFormData = new FormData();
    bodyFormData.append('text', text);
    let status = await postTweet(bodyFormData);
    if (status == null) {
      console.log("Could not post tweet!");
      return;
    }
    // clean textarea value
    setText("");
    // refresh tweets
    onPostCallback();
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <textarea
            className={classes.textarea}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick = {handlePost}>
          Post tweet
        </Button>
      </CardActions>
    </Card>
  );
}
