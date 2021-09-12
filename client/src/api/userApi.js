import { ApiHttpClient } from "../ApiHttpClient";

async function getUserData(userId) {
  try {
    const response = await ApiHttpClient().get("/user", {
      params: { userId: userId },
    });
    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }

  return null;
}

async function getUserTweetsForTabs(userId) {
  try {
    const response = await ApiHttpClient().get("/tweets", {
      params: { userId: userId },
    });
    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }

  return null;
}

export { getUserData, getUserTweetsForTabs };
