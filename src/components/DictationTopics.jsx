import React from "react";
import styles from "./DictationTopics.module.css";
import { useLoaderData, useNavigate } from "react-router-dom";
import {TopicItem} from "./TopicItem";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL
;


const loader = async () => {
    const res = await axios.get(`${apiUrl}/data/topics`);
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
            <div className={styles.container}>
                {topicArr && topicArr.length > 0 && topicArr.map(item => (
                <TopicItem url={item.url || ''} topicName={item.topicName || ''} noOfExercises={item.noOfExercises || 0}/>
                ))}
            </div>
        </>
    );
};

export {DictationTopics, loader};