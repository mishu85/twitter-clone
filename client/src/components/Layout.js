import Header from "./Header";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import Auth from "../auth";

export default function Layout(props) {
  let [showLogin, setShowLogin] = useState(props.showLogin);
  let [showAccount, setShowAccount] = useState(false);

  useEffect(() => {
    if (showLogin === undefined) {
        setShowLogin(true);
    }
    if (Auth.getInstance().isAuthenticated()) {
        setShowLogin(false);
        setShowAccount(true);
    } else {
        setShowAccount(false);
    }
  });

  return (
    <div id="layout">
      {props.noHeader === true ? null : (
        <Header
          title={props.title}
          showLogin={showLogin}
          showAccount={showAccount}
        />
      )}
      <main>{props.children}</main>

      {props.noFooter === true ? null : <Footer />}
    </div>
  );
}
