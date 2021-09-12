import {getTweets} from "../../api/tweetsApi"
import {useState, useEffect} from "react"
import TweetCard from "../shared/TweetCard"
import "./Home.css";
import Layout from "../Layout";
import PostTweetCard from "./homeComponents/PostTweetCard";
import Auth from "../../auth";

function Home() {
    const [data, setData] = useState(null);

    const getData = async () => {
        console.log("getting new tweets...");
        const response = await getTweets();
        setData(response)
    }

    useEffect( ()=>{getData()}, [] )

    return (
        <Layout title="Home" noFooter = {true}>
            <div id="tweets-container">
                {Auth.getInstance().isAuthenticated() ? <PostTweetCard onPost = {getData}/> : null}
                {data!= null ? data.map((item, index) => <TweetCard key={index} timestamp={item.timestamp} id={item._id} text = {item.text} user = {item.user}/>): null}
            </div>
        </Layout>
    )
}

export default Home;
