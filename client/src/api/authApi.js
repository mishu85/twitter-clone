// import axios from "axios";
import { ApiHttpClient } from "../ApiHttpClient";

async function postLogin(email, password) {
  try {
    var bodyFormData = new FormData();
    bodyFormData.append('email', email);
    bodyFormData.append('password', password);
    const response = await ApiHttpClient().post("/login", bodyFormData);
    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
  return null;
}

async function postSignup(email, password, repeatedPassword, firstName, lastName) {
  try {
    var bodyFormData = new FormData();
    bodyFormData.append('email', email);
    bodyFormData.append('password', password);
    bodyFormData.append('repeatedPassword', repeatedPassword);
    bodyFormData.append('firstName', firstName);
    bodyFormData.append('lastName', lastName);
    const response = await ApiHttpClient().post("/signup", bodyFormData);
    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
  return null;
}

async function postUserUpdate(
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
    const response = await ApiHttpClient().put("/me", bodyFormData);
    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
  return null;
}

async function getMyUserData() {
  try {
    const response = await ApiHttpClient().get("/me");
    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
  return null;
}

async function putUpdateAvatar(avatar) {
  try {
    var bodyFormData = new FormData();
    bodyFormData.append(
      "avatar",
      avatar,
      avatar.name
    );
    const response = await ApiHttpClient().put("/avatar", bodyFormData);
    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
  return null;
}

export { postLogin, postSignup, postUserUpdate, getMyUserData, putUpdateAvatar };
