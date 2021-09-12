import React from 'react';
import { Route, Redirect } from "react-router-dom";

const GuardedRouteAuth = ({ component: Component, auth, ...rest }) => (
    <Route {...rest} render={(props) => (
        auth === true
            ? <Component {...props} />
            : <Redirect to='/' />
    )} />
)

const GuardedRouteAuthReversed = ({ component: Component, auth, ...rest }) => (
    <Route {...rest} render={(props) => (
        auth === false
            ? <Component {...props} />
            : <Redirect to='/' />
    )} />
)

export {GuardedRouteAuth, GuardedRouteAuthReversed};