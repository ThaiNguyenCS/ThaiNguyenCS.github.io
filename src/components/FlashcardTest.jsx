import React, { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import styles from "./FlashcardTest.module.css";
import axios from "axios";
import { getJWTToken } from "../helper_function/authentication";
import IcAudio from "../assets/ic_audio.png";
import { NotifyBar } from "./NotifyBar";

const dataURL = import.meta.env.VITE_DATA_URL;

const loader = async ({ params }) => {
    const wordResponse = await axios.get(`${dataURL}/flashcard/${params.id}/practice-words`, {
        headers: {
            Authorization: `Bearer ${getJWTToken() || "no_token"}`,
        },
    });
    const loaderData = {};
    const data = wordResponse.data;

    if (data.words?.result) {
        loaderData["words"] = data.words.data;
    }
    if (data.collection?.result) {
        loaderData["collection"] = data.collection.data.collection;
    }
    console.log(loaderData);
    return loaderData;
};

const action = () => {};

const FlashcardTest = () => {
    const { collection, words } = useLoaderData();
    const [maxProgress, setMaxProgress] = useState(0);
    const [progress, setProgress] = useState(1); // for progress bar
    const [currentIdx, setCurrentIdx] = useState(0); // current word's idx
    const notifyLifeSpan = 2400;
    const progressBarRef = useRef(null);
    const indicatorRef = useRef(null);
    const cardRef = useRef(null);
    const audioRef = useRef(null);
    const targetQuestionRef = useRef(null);
    const nextQuestionButtonRef = useRef(null);
    const [input, setInput] = useState("");
    const [isNext, setIsNext] = useState(false); // true when user complete the question and takes some time to review it.
    const [isFinish, setFinish] = useState(false);

    const notifyQueue = useRef([]);
    const [currentNotify, setCurrentNotify] = useState(null);

    const [answerStatus, setAnswerStatus] = useState(0);

    useEffect(() => {
        if (cardRef.current) {
            function cardAnimationCallback() {
                cardRef.current.classList.remove(styles["animate"]);
            }
            cardRef.current.addEventListener("animationend", cardAnimationCallback);
            return () => {
                cardRef.current.removeEventListener("animationend", cardAnimationCallback);
            };
        }
    }, []);

    useEffect(() => {
        if (collection && words) {
            setMaxProgress(words.length);
        } else {
            console.log("No collection or words");
        }
    }, [words, collection]);

    useEffect(() => {
        if (isNext) {
            if (nextQuestionButtonRef.current) {
                function nextButtonAnimationCallback(e) {
                    e.stopPropagation();
                    setIsNext(false); // return to question display
                    setCurrentIdx((state) => state + 1);
                }
                nextQuestionButtonRef.current.addEventListener("animationend", nextButtonAnimationCallback);
            }
        }
    }, [isNext]);

    useEffect(() => {
        if (progress <= maxProgress + 1 && progressBarRef && indicatorRef) {
            // console.log(progressBarRef.current.getBoundingClientRect().width);
            // console.log(indicatorRef.current.getBoundingClientRect().width);
            indicatorRef.current.style.width =
                ((progress - 1) / maxProgress) * progressBarRef.current.getBoundingClientRect().width + "px";
        }
    }, [progress]);

    const handleAnswerInput = (e) => {
        setInput(e.target.value);
    };

    const nextQuestion = () => {
        setTimeout(() => {
            setAnswerStatus(0)
        }, 650)
        if (!isFinish) {
            nextQuestionButtonRef.current.classList.add(styles["animate"]);
            cardRef.current.classList.add(styles["animate"]);
        }
    };

    const evaluateAnswer = () => {
        let formattedAns = input.trim().toLowerCase();
        if (formattedAns === words[currentIdx].word) {
            console.log("true");
            setAnswerStatus(1);
        } else {
            console.log("false");
            setAnswerStatus(-1);
        }
        if (progress === maxProgress) {
            setFinish(true);
            if (targetQuestionRef) {
                targetQuestionRef.current.classList.add(styles["finish"]);
                targetQuestionRef.current.classList.add(styles["while-finish"]);
                setTimeout(() => {
                    targetQuestionRef.current.classList.remove(styles["while-finish"]);
                }, 1000);
                setProgress((state) => state + 1); // to fill the progress bar
            }
        } else if (progress < maxProgress) {
            // setInput("");
            setProgress((state) => state + 1);
        }
        setIsNext(true);
    };

    const playAudio = () => {
        if (words[currentIdx].audioURL) {
            audioRef.current.play();
        } else {
            if (!currentNotify) {
                displayNotify(<NotifyBar key={Math.random()} message="No audio for this word"></NotifyBar>);
            } else {
                console.log("daw");
                notifyQueue.current.push(<NotifyBar key={Math.random()} message="No audio for this word"></NotifyBar>);
            }
        }
    };

    const runNextNotification = () => {
        if (notifyQueue.current.length > 0) {
            console.log("next");
            displayNotify(notifyQueue.current.at(-1));
            notifyQueue.current = notifyQueue.current.slice(0, -1);
        }
    };

    const displayNotify = (notify) => {
        setCurrentNotify(notify);
        setTimeout(() => {
            setCurrentNotify(null);
            runNextNotification();
        }, notifyLifeSpan);
    };

    const answerStatusClassname = () => {
        if (answerStatus === 1) {
            return styles["correct"];
        } else if (answerStatus === -1) {
            return styles["incorrect"];
        }
        return "";
    };

    return (
        <>
            <div className={styles["container"]}>
                <div className={styles["status-bar-container"]}>
                    <div className={styles["current-question"]}>{Math.min(progress, maxProgress)}</div>
                    <div className={styles["status-bar"]}>
                        <div className={styles["status-bar-track"]} ref={progressBarRef}></div>
                        <div className={styles["status-bar-indicator"]} ref={indicatorRef}></div>
                    </div>
                    <div className={styles["target-question"]} ref={targetQuestionRef}>
                        {maxProgress}
                    </div>
                </div>
                <div className={styles["card"]} ref={cardRef}>
                    <img
                        src={IcAudio}
                        className={`audio-button ${styles["audio-button"]}`}
                        onClick={() => playAudio()}
                    ></img>
                    <div className={styles["question"]}>{words[currentIdx].wordDef}</div>
                    <input
                        type="text"
                        className={`${styles["answer-input"]} ${answerStatusClassname()}`}
                        placeholder="Your answer..."
                        value={input}
                        readOnly={isNext}
                        onChange={(e) => handleAnswerInput(e)}
                    />
                    {(isFinish || isNext) && (
                        <div className={`${styles["question-result"]} `}>Answer: {words[currentIdx].word}</div>
                    )}
                    {!isFinish &&
                        (isNext ? (
                            <button
                                className={`${styles["next-button"]}`}
                                onClick={() => nextQuestion()}
                                ref={nextQuestionButtonRef}
                            >
                                Next
                            </button>
                        ) : (
                            <>
                                <button
                                    className={`${styles["check-button"]} ${input ? styles["active"] : ""}`}
                                    onClick={() => {
                                        evaluateAnswer();
                                    }}
                                >
                                    Check
                                </button>
                                <div className={styles["skip-button"]}>Skip</div>
                            </>
                        ))}
                    {isFinish && <button className={`${styles["check-button"]} ${styles["active"]}`}>Finish</button>}
                </div>
            </div>
            <div className={styles["notifi-container"]}>{currentNotify}</div>
            <audio src={words[currentIdx].audioURL} ref={audioRef}></audio>
        </>
    );
};
export { FlashcardTest, loader, action };
