import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Tabs, Tab, Box } from "@material-ui/core";
import TweetCard from "../../shared/TweetCard"
import { useState, useEffect } from "react";
import { getTweetsForUserById } from "../../../api/usersApi";

function TabPanel(props) {
  const { children, value, index, data, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden = {value !== index}
      
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {data!= null ? data.map((item, index) => <TweetCard key={index} timestamp={item.timestamp} id={item._id} text = {item.text} user = {item.user}/>): null}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    alignItems: "center",
    maxWidth: 585,
    marginBottom: 40,
    width: "100%",
  },
}));


 
export default function UserTabbedView(props) {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const userId = props.userId;
  const [data, setData] = useState(null);


  const initialLoad = async () => {
    const response = await getTweetsForUserById(userId);
    setData(response);
  };

  useEffect(() => {
    initialLoad();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Timeline" {...a11yProps(0)} />
          <Tab label="Liked Tweets" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} data={data} />
      <TabPanel value={value} index={1} data={data} />
    </div>
  );
}
