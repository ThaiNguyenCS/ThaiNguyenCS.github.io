import React from "react";
import { useEffect } from "react";
import "./Dictation.css";
import { useState } from "react";
import { useRef } from "react";

import { FaArrowRotateLeft } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import Youtube from "react-youtube";
import CompleteNotify from "./CompleteNotify";
import SubmitPopup from "./SubmitPopup";
import { openPopup } from "../slicers/SubmitPopupSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { handleInput as preprocessStr } from "../helper_function/handleInput";
import { useLoaderData } from "react-router-dom";

const statusStr = ["Not done", "Incorrect", "Done"];
// const arr = [0, 5.64, 8.64, 18.4, 30.6, 34.08, 38.24, 45.56, 171]; // arr.length-1 = the number of questions
const sentences = [
    "These are silver with dot ...",
    "These are silver",
    "These are silver",
    "These are silver",
    "These are silver",
    "These are silver",
    "These are silver",
    "These are silver",
    "These are silver",
    "These are silver",
];

const loader = async ({ params, request }) => {
    console.log(`request to /data/${params.topic}/${params.exerciseID}`);
    const res = await axios.get(`/data/${params.topic}/${params.exerciseID}`);
    let result = res.data; // {status, array}
    let video;
    if (result.status && result.data.length > 0) {
        video = result.data[0]; // extract video from array
    } else return null;

    console.log(video);
    let timelines = video.timeline;
    timelines = timelines
        .split(",")
        .map((item) => item.trim())
        .map(Number);
    video.timeline = timelines;
    console.log(video);
    return video;
};

const action = async ({ params }) => {};

// idx start with 1

const Dictation = (props) => {
    const {timeline, title, noOfQuestions, videoID} = useLoaderData();
    const video = useRef(null);
    const [play, setPlay] = useState(false);
    const dispatch = useDispatch();
    const [idx, setIdx] = useState(1);
    const [input, setInput] = useState("");
    const [back, setBack] = useState(false);
    const [next, setNext] = useState(false);
    const [replay, setReplay] = useState(false);
    const intervalRef = useRef(null);
    const nextButton2 = useRef(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [result, setResult] = useState(false);
    const [statusArr, setStatusArr] = useState(new Array(timeline.length).fill(-1));
    const isPopupOpen = useSelector((state) => state.submitPopup.isOpen);

    useEffect(() => {
        if (video.current) {
            if (play) {
                const startIdx = idx > 0 ? idx - 1 : 0;
                const currentTime = video.current.getCurrentTime();
                if (!(currentTime >= timeline[startIdx] && currentTime < timeline[idx]))
                    video.current.seekTo(timeline[startIdx]);
                intervalRef.current = setInterval(() => {
                    // console.log(
                    //     `${video.current.getCurrentTime()} vs ${arr[idx]}`
                    // );

                    if (video.current.getCurrentTime() > timeline[idx]) {
                        pauseVideo();
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                }, 50);
            } else {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            return () => {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            };
        }
    }, [play]);

    useEffect(() => {
        if (replay) {
            pauseVideo();
            setReplay(false);
            const startIdx = idx - 1;
            video.current.seekTo(arr[startIdx > 0 ? startIdx : 0]);
            playVideo();
        }
    }, [replay]);

    useEffect(() => {
        if (back) {
            pauseVideo();
            if (idx > 1) {
                setIdx((state) => state - 1);
            } else setIdx(1);
        }
    }, [back]);

    useEffect(() => {
        if (next) {
            pauseVideo();
            if (idx < timeline.length - 1) setIdx((state) => state + 1);
            else setIdx(timeline.length - 1);
        }
    }, [next]);

    useEffect(() => {
        if (video.current) {
            const startIdx = idx - 1;
            // console.log(`startIdx = ${startIdx}`);
            video.current.seekTo(timeline[startIdx > 0 ? startIdx : 0]);
            if (back) {
                setBack(false);
                // playVideo();
            }
            if (next) {
                setNext(false);
                // playVideo();
            }
        }
    }, [idx]);

    const onReady = (event) => {
        // bind Youtube Video to video.current
        video.current = event.target;
    };

    const playVideo = () => {
        hideAnswerContainer();
        video.current.playVideo();
    };

    const pauseVideo = () => {
        video.current.pauseVideo();
    };

    const handleInput = (e) => {
        hideAnswerContainer();
        setInput(e.target.value);
    };

    const backToPreviousQuestion = () => {
        setInput("");
        setResult(false);
        hideAnswerContainer();
        setBack(true);
    };

    const nextQuestion = () => {
        setInput("");
        setResult(false);
        hideAnswerContainer();
        setNext(true);
    };

    const replayQuestion = () => {
        setResult(false);
        hideAnswerContainer();
        setReplay(true);
    };

    const handleOnKeyDownInput = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleCheckResult();
        }
    };

    const showAnswerContainer = () => {
        setShowAnswer(true);
    };

    const hideAnswerContainer = () => {
        setShowAnswer(false);
    };

    useEffect(() => {
        // console.log("Show answer" + showAnswer);
    }, [showAnswer]);

    useEffect(() => {
        if (result) {
            if (nextButton2.current) {
                nextButton2.current.focus();
            }
        }
    }, [result]);

    const handleCheckResult = () => {
        // get input and compare
        const formattedInput = preprocessStr(input);
        let formattedKey = preprocessStr(sentences[idx - 1]);

        console.log(`${formattedInput}`);
        console.log(`${formattedKey}`);

        if (formattedInput === formattedKey) {
            console.log("RIGHT");
            setResult(true);
            setStatusArr((state) => {
                const newState = [...state];
                newState[idx] = 1;
                return newState;
            });
        } else {
            console.log("WRONG");
            setResult(false);
            setStatusArr((state) => {
                if (state[idx] === 1) return state;
                const newState = [...state];
                newState[idx] = 0;
                return newState;
            });
        }

        showAnswerContainer();
    };

    const returnCorrectStatus = () => {
        switch (statusArr[idx]) {
            case 0:
                return "incorrect";
            case 1:
                return "correct";
        }
    };

    const handleSubmit = () => {
        dispatch(openPopup());
    };

    return (
        <>
            <div className="dictation-container">
                <div className="left-section">
                    <Youtube
                        videoId={videoID || ''}
                        className="video-container"
                        onReady={(e) => onReady(e)}
                        opts={{
                            width: "100%",
                            height: "100%",
                        }}
                        onPlay={() => {
                            // findNearestIdx();
                            setPlay(true);
                        }}
                        onPause={() => {
                            setPlay(false);
                        }}
                        onEnd={() => {
                            setPlay(false);
                        }}
                    ></Youtube>
                </div>
                <div className="right-section">
                    <div className="control-container">
                        <FaArrowRotateLeft
                            id="replay-button"
                            onClick={() => replayQuestion()}
                        ></FaArrowRotateLeft>

                        <div className="middle-section">
                            <IoIosArrowBack
                                id="back-button"
                                onClick={() => backToPreviousQuestion()}
                            ></IoIosArrowBack>
                            <div id="question-info">
                                Question: {idx}/{noOfQuestions}
                            </div>
                            <IoIosArrowForward
                                id="next-button"
                                onClick={() => {
                                    nextQuestion();
                                }}
                            ></IoIosArrowForward>
                        </div>
                        <div
                            className={`question-status ${returnCorrectStatus()}`}
                        >
                            {statusStr[statusArr[idx] + 1]}
                        </div>
                    </div>

                    <textarea
                        className="input-area"
                        value={input}
                        placeholder="Enter your answer here..."
                        rows={4}
                        accessKey="Enter"
                        onChange={(e) => handleInput(e)}
                        onKeyDown={(e) => handleOnKeyDownInput(e)}
                    />

                    {showAnswer ? (
                        <>
                            <div className="answer-container">
                                <div className="answer-title">Answer</div>
                                <textarea
                                    className={`answer-textarea ${
                                        result
                                            ? "correct-answer"
                                            : "wrong-answer"
                                    }`}
                                    readOnly
                                    value={sentences[idx - 1]}
                                />
                            </div>
                            {result ? (
                                <button
                                    id="next-button2"
                                    ref={nextButton2}
                                    onClick={() => {
                                        nextQuestion();
                                    }}
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    id="skip-button2"
                                    onClick={() => {
                                        nextQuestion();
                                    }}
                                >
                                    Skip
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="check-option-container">
                                <button className="check-button invisible-button">
                                    check
                                </button>
                                <div
                                    id="skip-button"
                                    onClick={() => showAnswerContainer()}
                                >
                                    Skip
                                </div>
                                <button
                                    className="check-button"
                                    onClick={() => {
                                        // showAnswerContainer();
                                        handleCheckResult();
                                    }}
                                >
                                    Check
                                </button>
                            </div>
                        </>
                    )}

                    <button
                        id="submit-button"
                        onClick={() => {
                            handleSubmit();
                        }}
                    >
                        Submit
                    </button>
                </div>
            </div>

            {isPopupOpen && <SubmitPopup></SubmitPopup>}
        </>
    );
};

export default Dictation;
export { loader, action };
