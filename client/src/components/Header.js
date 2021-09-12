import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddCommentIcon from "@material-ui/icons/AddComment";
// import {withRouter} from 'react-router-dom';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import React from "react";
import Auth from "../auth";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Header(props) {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          href="/"
          // onClick={()=>props.history.push("/")}
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <AddCommentIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {props.title}
        </Typography>
        {props.showLogin === true ? (
          <Button
            color="inherit"
            href="/login"
            // onClick={()=>props.history.push("/login")}
          >
            Login
          </Button>
        ) : null}
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <React.Fragment>
              {props.showAccount === true ? (
                <Button
                  variant="contained"
                  color="secondary"
                  {...bindTrigger(popupState)}
                >
                  User menu
                </Button>
              ) : null}
              <Menu {...bindMenu(popupState)}>
                <MenuItem onClick={() => {popupState.close(); window.open("/user/"+Auth.getInstance().getMyUser().id, "_self");}}>My Profile</MenuItem>
                <MenuItem onClick={() => {popupState.close(); window.open("/account", "_self");}}>Account</MenuItem>
                <MenuItem onClick={() => {popupState.close(); Auth.getInstance().logout(); window.open("/", "_self");}}>Logout</MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </PopupState>
      </Toolbar>
    </AppBar>
  );
}

// export default withRouter(Header);
export default Header;
