import React from "react";
import "./DictationTopics.css";
import { useLoaderData, useNavigate } from "react-router-dom";
import TopicItem from "./TopicItem";
import axios from "axios";

const loader = async () => {
    const res = await axios.get("/data/topics");
    const result = res.data;
    if(result.status)
    {
        return result.data;
    }
    console.log(`error at DictationTopics loader ${result.error}`);
    return null;
}

const DictationTopics = () => {
    const topicArr = useLoaderData();
    return (
        <>
            <div className="container">
                {topicArr && topicArr.length > 0 && topicArr.map(item => (
                <TopicItem url={item.url || ''} topicName={item.topicName || ''} noOfExercises={item.noOfExercises || 0}/>
                ))}
            </div>
        </>
    );
};

export default DictationTopics;
export {loader};