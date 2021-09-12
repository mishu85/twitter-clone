import {Router, Switch, Route} from "react-router-dom";
import { createBrowserHistory } from "history";
import {useEffect} from "react";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Account from "./components/pages/Account";
import User from "./components/pages/User";
import Page404 from "./components/pages/Page404";
import Auth from "./auth";
import {GuardedRouteAuth, GuardedRouteAuthReversed} from "./GuardedRoute";

const history = createBrowserHistory();

function App() {
  return (
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={Home}/>
          <GuardedRouteAuthReversed auth={Auth.getInstance().isAuthenticated()} exact path="/login" component={Login} />
          <GuardedRouteAuthReversed auth={Auth.getInstance().isAuthenticated()} exact path="/signup" component={Signup} />
          <GuardedRouteAuth auth={Auth.getInstance().isAuthenticated()} exact path="/account" component={Account} />
          <Route path="/user/:id" component={User}/>
          <Route component={Page404}/>
        </Switch>
      </Router>
  );
}

export default App;
