import { ApiHttpClient } from "../ApiHttpClient";

async function getUserById(userId) {
  try {
    const response = await ApiHttpClient().get("/users/" + userId);
    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
  return null;
}

async function getTweetsForUserById(userId) {
  try {
    const response = await ApiHttpClient().get("/users/" + userId + "/tweets");
    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
  return null;
}

async function login(email, password) {
  try {
    var bodyFormData = new FormData();
    bodyFormData.append('email', email);
    bodyFormData.append('password', password);
    const response = await ApiHttpClient().post("/users/login", bodyFormData);
    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
  return null;
}

async function register(email, password, repeatedPassword, firstName, lastName) {
  try {
    var bodyFormData = new FormData();
    bodyFormData.append('email', email);
    bodyFormData.append('password', password);
    bodyFormData.append('repeatedPassword', repeatedPassword);
    bodyFormData.append('firstName', firstName);
    bodyFormData.append('lastName', lastName);
    const response = await ApiHttpClient().post("users/register", bodyFormData);
    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
  return null;
}

async function updateMe(
  email,
  oldPassword,
  firstName,
  lastName,
  newPassword
) {
  try {
    var bodyFormData = new FormData();
    bodyFormData.append('email', email);
    bodyFormData.append('password', oldPassword);
    bodyFormData.append('firstName', firstName);
    bodyFormData.append('lastName', lastName);
    bodyFormData.append('newPassword', newPassword);
    const response = await ApiHttpClient().put("/users/me", bodyFormData);
    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
  return null;
}

async function getMe() {
  try {
    const response = await ApiHttpClient().get("/users/me");
    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
  return null;
}

async function updateAvatar(avatar) {
  try {
    var bodyFormData = new FormData();
    bodyFormData.append(
      "avatar",
      avatar,
      avatar.name
    );
    const response = await ApiHttpClient().put("/users/avatar", bodyFormData);
    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
  return null;
}

export { getUserById, getTweetsForUserById, login, register, updateMe, getMe, updateAvatar };
