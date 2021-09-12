import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PublicIcon from '@material-ui/icons/Public';

const useStyles = makeStyles(theme => ({
    icon: {
      marginRight: theme.spacing(2),
    },
    text: {
      flexGrow: 1,
    },
    boldText: {
        fontWeight: "bold",
        color: "yellow"
        
    },
    footer: {
        position:"fixed",
        bottom: 0,
        backgroundColor:"black",
        color:"grey"
    }
  }));

function Footer() {
    const classes = useStyles();

    return (
        <AppBar position = "static" className={classes.footer}>
            <Toolbar>
          <PublicIcon 
          edge="start" className={classes.icon} color="inherit" aria-label="menu" />
          <Typography variant="body2" className={classes.text}>
          <span className={classes.boldText}>021.4520</span> - Bd. Splaiului, 49
          </Typography>
        </Toolbar>
        </AppBar>
    )
}

export default Footer;
