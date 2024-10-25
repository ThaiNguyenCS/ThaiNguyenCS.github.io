import React, { createContext, useContext } from "react";
import { useEffect } from "react";
import styles from "./Dictation.module.css";
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
import { handleInput as preprocessStr } from "../utils/handleInput";
import { Link, useLoaderData } from "react-router-dom";
import { SpanWithDictionary } from "./SpanWithDictionary";
import { ContextDictionary } from "./ContextDictionary";
import { openDict, resetDict } from "../slicers/ContextDictSlice";
import { axiosRequestWithCookieOption } from "../utils/requestOption";

const apiURL = import.meta.env.VITE_API_URL;

const statusStr = ["Not done", "Incorrect", "Done"];
// const arr = [0, 5.64, 8.64, 18.4, 30.6, 34.08, 38.24, 45.56, 171]; // arr.length-1 = the number of questions
const sentences = [
    "test test test test test test test notest test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test",
    "test test",
    "test test",
    "test test",
    "test test",
    "test test",
    "test test",
    "test test",
    "test test",
    "test test",
];

const DictationExContext = createContext(null);

const loader = async ({ params, request }) => {
    console.log(`request to /data/${params.topic}/${params.exerciseID}`);

    
    const res = await axios.get(
        `${apiURL}/data/${params.topic}/${params.exerciseID}`, axiosRequestWithCookieOption
    );
    let result = res.data; // {status, isSaved, data}
    let video;
    if (result.status && result.data.length > 0) {
        video = result.data[0]; // extract video from array
        if (result.isSaved) {
            // Convert resultArr str to resultArr array
            video.resultArr = JSON.parse(video.resultArr);
            console.log(video.resultArr);
        }
    } else return {};

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
    const {
        timeline,
        title,
        noOfQuestions,
        videoID,
        videoType,
        id,
        resultArr,
        youtubeID,
    } = useLoaderData();
    const video = useRef(null);
    const [play, setPlay] = useState(false);
    const dispatch = useDispatch();
    const [idx, setIdx] = useState(1);
    const [input, setInput] = useState("");
    const [back, setBack] = useState(false);
    const [next, setNext] = useState(false);
    const [replay, setReplay] = useState(false);

    const [showAnswer, setShowAnswer] = useState(false);
    const [result, setResult] = useState(false);
    const [statusArr, setStatusArr] = useState([]);

    const intervalRef = useRef(null);
    const nextButton2 = useRef(null);
    const contextDictRef = useRef(null);
    const answerContainerRef = useRef(null);
    const inputRef = useRef(null);

    const isPopupOpen = useSelector((state) => state.submitPopup.isOpen);
    const isUserLogin = useSelector((state) => state.appState.isLogined);
    const contextDict = useSelector((state) => state.dictState);

    useEffect(() => {
        if (resultArr) {
            setStatusArr(resultArr);
        }
    }, [resultArr]);

    useEffect(() => {
        if (video.current) {
            if (play) {
                const startIdx = idx > 0 ? idx - 1 : 0;
                const currentTime = video.current.getCurrentTime();
                if (
                    !(
                        currentTime >= timeline[startIdx] &&
                        currentTime < timeline[idx]
                    )
                )
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
            else {
                handleSubmit();
                return;
            }
            if (inputRef.current) {
                inputRef.current.focus();
            }
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
        if (idx) setInput("");
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
        return () => {
            dispatch(resetDict());
        };
    }, []);

    useEffect(() => {
        // console.log("Show answer" + showAnswer);
    }, [showAnswer]);

    useEffect(() => {
        if (result) {
            // if result's right, focus to the next question button
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
                newState[idx - 1] = 1;
                return newState;
            });
        } else {
            console.log("WRONG");
            setResult(false);
            setStatusArr((state) => {
                if (state[idx] === 1) return state;
                const newState = [...state];
                newState[idx - 1] = 0;
                return newState;
            });
        }

        showAnswerContainer();
    };

    const returnCorrectStatus = () => {
        switch (statusArr[idx - 1]) {
            case 0:
                return "incorrect";
            case 1:
                return "correct";
        }
    };

    const handleSubmit = () => {
        dispatch(openPopup());
    };

    const handleContextDictionary = (e, clickedWord) => {
        // console.log(contextDictRef.current.getBoundingClientRect());
        // console.log(e.pageX);
        // console.log(e.pageY);
        // console.log(e.target);
        const clickedItemRect = e.target.getBoundingClientRect();
        const dictRect = contextDictRef.current.getBoundingClientRect();

        dispatch(
            openDict({
                x: e.pageX - dictRect.width / 2 + clickedItemRect.width / 2,
                y: e.pageY + clickedItemRect.height + 3,
                selectedWord: clickedWord,
            })
        );
    };

    const generateAnswerSpans = () => {
        // console.log("width = " + answerCont  ainerRef.current.style.width);
        const answer = sentences[idx - 1];
        if (answer) {
            let answerSpan = answer.split(" ");
            return (
                <>
                    {answerSpan.map((item, idx) => (
                        <>
                            <SpanWithDictionary
                                text={item}
                                key={idx}
                                onClick={(e) =>
                                    handleContextDictionary(e, item)
                                }
                            ></SpanWithDictionary>
                        </>
                    ))}
                </>
            );
        }
        return "No answer";
    };

    return (
        <>
            {isUserLogin ? (
                <>
                    {" "}
                    <div className={styles["dictation-container"]}>
                        <div className={styles["left-section"]}>
                            <Youtube
                                videoId={youtubeID || ""}
                                className={styles["video-container"]}
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
                        <div className={styles["right-section"]}>
                            <div className={styles["control-container"]}>
                                <FaArrowRotateLeft
                                    className={styles['replay-button']}
                                    onClick={() => replayQuestion()}
                                ></FaArrowRotateLeft>

                                <div className={styles["middle-section"]}>
                                    <IoIosArrowBack
                                        className={styles["back-button"]}
                                        onClick={() => backToPreviousQuestion()}
                                    ></IoIosArrowBack>
                                    <div className={styles["question-info"]}>
                                        Question: {idx}/{noOfQuestions}
                                    </div>
                                    <IoIosArrowForward
                                        className={styles["next-button"]}
                                        onClick={() => {
                                            nextQuestion();
                                        }}
                                    ></IoIosArrowForward>
                                </div>
                                <div
                                    className={`${styles['question-status']} ${styles[returnCorrectStatus()]}`}
                                >
                                    {statusStr[statusArr[idx - 1] + 1]}
                                </div>
                            </div>

                            <textarea
                                className={styles["input-area"]}
                                value={input}
                                placeholder="Enter your answer here..."
                                rows={4}
                                ref={inputRef}
                                accessKey="Enter"
                                onChange={(e) => handleInput(e)}
                                onKeyDown={(e) => handleOnKeyDownInput(e)}
                            />

                            {showAnswer ? (
                                <>
                                    <div className={styles["answer-container"]}>
                                        <div className={styles["answer-title"]}>
                                            Answer
                                        </div>
                                        <div
                                            ref={answerContainerRef}
                                            className={`${
                                                styles["answer-textarea"]} 
                                                ${styles[
                                                result
                                                    ? "correct-answer"
                                                    : "wrong-answer"
                                            ]}`}
                                        >
                                            {generateAnswerSpans()}
                                            {/* test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test */}
                                        </div>
                                    </div>
                                    {result ? (
                                        <button
                                            className={styles["next-button2"]}
                                            ref={nextButton2}
                                            onClick={() => {
                                                nextQuestion();
                                            }}
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                        className={styles["skip-button2"]}
                                            onClick={() => {
                                                nextQuestion();
                                            }}
                                        >
                                            Skip
                                        </button>
                                    )}
                                    <ContextDictionary
                                        contextDictRef={contextDictRef}
                                        isToggled={contextDict.toggled}
                                        positionX={contextDict.position.x}
                                        positionY={contextDict.position.y}
                                    ></ContextDictionary>
                                </>
                            ) : (
                                <>
                                    <div className={styles["check-option-container"]}>
                                        <button className={`${styles["check-button"]} ${styles["invisible-button"]}`}>
                                            check
                                        </button>
                                        <div
                                            className={styles["skip-button"]}
                                            onClick={() =>
                                                showAnswerContainer()
                                            }
                                        >
                                            Skip
                                        </div>
                                        <button
                                            className={styles["check-button"]}
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
                                className={styles["submit-button"]}
                                onClick={() => {
                                    handleSubmit();
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                    {isPopupOpen && (
                        <>
                            <DictationExContext.Provider
                                value={{ statusArr, videoID: id, videoType }}
                            >
                                <SubmitPopup></SubmitPopup>
                            </DictationExContext.Provider>
                        </>
                    )}
                </>
            ) : (
                <div>
                    Please <Link to="/login">login</Link> to do this exercise
                </div>
            )}
        </>
    );
};

export { Dictation, loader, action, DictationExContext };
