import React from "react";
import youtubePoster from "../assets/youtube_topic.webp";
import { useNavigate } from "react-router-dom";
import "./TopicItem.css"

const TopicItem = (props) => {
    const navigate= useNavigate();

    const handleNavigation = (url) => {
        navigate(`/dictation/${url}`);
    };


    return (
        <>
            <div
                className="topic-holder"
                onClick={() => handleNavigation(props.url)}
            >
                <div className="topic-img-holder">
                    <img
                        src={youtubePoster}
                        alt="Youtube"
                        className="topic-img"
                    />
                </div>
                <div className="topic-title">{props.topicName}</div>
                <div className="topic-exercise-count">Exercises: {props.noOfExercises}</div>
            </div>
        </>
    );
};

export  {TopicItem};
