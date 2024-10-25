import React from "react";
import youtubePoster from "../assets/youtube_topic.webp";
import { useNavigate } from "react-router-dom";
import styles from "./TopicItem.module.css"

const TopicItem = (props) => {
    const navigate= useNavigate();

    const handleNavigation = (url) => {
        navigate(`/dictation/${url}`);
    };
    return (
        <>
            <div
                className={styles['topic-holder']}
                onClick={() => handleNavigation(props.url)}
            >
                <div className={styles['topic-img-holder']}>
                    <img
                        src={youtubePoster}
                        alt="Youtube"
                        className={styles["topic-img"]}
                    />
                </div>
                <div className={styles["topic-title"]}>{props.topicName}</div>
                <div className={styles["topic-exercise-count"]}>Exercises: {props.noOfExercises}</div>
            </div>
        </>
    );
};

export  {TopicItem};
