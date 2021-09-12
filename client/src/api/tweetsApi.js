// import axios from "axios";
import { ApiHttpClient } from "../ApiHttpClient";

async function getTweets() {
  try {
    const response = await ApiHttpClient().get("/tweets"); //axios.get("http://localhost:3000" + "/data/tweets.json");
    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }

  return null;
}

async function postTweet(tweet) {
  try {
    console.log(tweet);
    const response = await ApiHttpClient().post("/tweets", tweet);
    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }

  return null;
}

export { getTweets, postTweet };
