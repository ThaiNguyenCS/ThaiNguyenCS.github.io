import React, { useEffect, useRef, useState } from "react";
import styles from "./FlashcardPractice.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import { getJWTToken } from "../helper_function/authentication"
import { useLoaderData, useSubmit } from "react-router-dom";
const dataURL = import.meta.env.VITE_DATA_URL;

const loader = async ({ request, params }) => {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.searchParams);
    const wordResponse = await axios.get(
        `${dataURL}/flashcard/${params.id}/practice-words/?limit=${queryParams.get("limit")}`,
        {
            headers: {
                Authorization: `Bearer ${getJWTToken() || "no_token"}`,
            },
        }
    );
    const loaderData = {};
    const data = wordResponse.data;

    if (data.words?.result) {
        loaderData["words"] = data.words.data;
    }
    if (data.collection?.result) {
        loaderData["collection"] = data.collection.data.collection;
    }
    return loaderData;
};

const action = async ({ request, params }) => {
    const formData = await request.formData();
    if (formData.get("_action") === "SAVE_PROGRESS") {
        console.log(formData.get("words"));
        try {
            const result = await axios.put(`${dataURL}/flashcard/${params.id}/practice-words`, formData, {
                headers: {
                    Authorization: `Bearer ${getJWTToken() || "no_token"}`
                }
            });
            return {isSaved: true, result}
            
        } catch (error) {
            return {isSaved: false}
        }
    }
    return null;
};

const FlashcardPractice = () => {
    console.log("rerrenderr");

    const { words, collection } = useLoaderData();
    const [flipCard, setFlipcard] = useState(false);
    const [resultCard, setResultCard] = useState(null);
    const instantFlip = useRef(false);
    const flashcardRef = useRef(null);
    const resultCardRef = useRef(null);
    const [currentRound, setCurrentRound] = useState([]); // idx of word in words
    const nextRound = useRef([]); // // idx of word in words
    const [currentWordIdx, setCurrentWordIdx] = useState(0); // idx in the currentRound

    const submit = useSubmit();

    const goToTheNextCard = (status) => {
        if (currentWordIdx < currentRound.length - 1) {
            setResultCard(status);
            if (status === -1) {
                nextRound.current.push(currentRound[currentWordIdx]); // get the current word's idx in words for relearning
            }
            setCurrentWordIdx((state) => state + 1);
            instantFlip.current = true; // enable instant flip
            setFlipcard(false); // reflip the card
        } else {
            if (nextRound.current.length > 0) {
                setCurrentRound(nextRound.current);
                setCurrentWordIdx(0);
                instantFlip.current = true; // enable instant flip
                setFlipcard(false); // reflip the card
                nextRound.current = []; // reset the nextRound array
            } else {
                // save the progress
                const formData = new FormData();
                formData.append("_action", "SAVE_PROGRESS");
                formData.append(
                    "words",
                    JSON.stringify(
                        words.map((item) => {
                            return {
                                id: item.id,
                                lastAttemptDate: item.lastAttemptDate,
                                learningTime: item.learningTime,
                            };
                        })
                    )
                );
                submit(formData, {
                    method: "PUT",
                });
                alert("The End!");
            }
        }
    };

    useEffect(() => {
        if (words.length > 0) {
            setCurrentWordIdx(0);
            setCurrentRound(words.map((item, idx) => idx));
        }
    }, [words]);

    useEffect(() => {
        if (instantFlip.current) {
            flashcardRef.current.style.transition = "none"; // bypass transition
            instantFlip.current = false;
            setTimeout(() => {
                flashcardRef.current.style.transition = ""; // give the priority for the css defined transition
            }, 10);
        }
    }, [flipCard]);

    useEffect(() => {
        if (resultCard !== null) {
            const timeout = setTimeout(() => {
                console.log("set to null");
                setResultCard(null);
            }, 300);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [resultCard]);

    const resultCardMapping = () => {
        switch (resultCard) {
            case -1:
                return "forgot";
            case 1:
                return "remembered";
            default:
                return "";
        }
    };

    const resultStrMapping = () => {
        switch (resultCard) {
            case -1:
                return "Forgot";
            case 1:
                return "Remembered";
            default:
                return "";
        }
    };

    return (
        <>
            <div className={styles["container"]}>
                <div className={styles["title"]}>{collection?.title}</div>
                <div className={styles["no-of-Words"]}>{words?.length} words</div>
                <div
                    className={`${styles["flashcard-container"]} ${flipCard ? styles["flipped"] : ""}`}
                    ref={flashcardRef}
                    onClick={() => {
                        setFlipcard((state) => !state);
                    }}
                >
                    <div
                        className={`${styles["front-side"]} 
                        `}
                    >
                        {words[currentRound[currentWordIdx]]?.word || "dawd"}
                    </div>
                    <div className={`${styles["back-side"]}`}>{words[currentRound[currentWordIdx]]?.wordDef}</div>
                    <div className={`${styles["result-card"]} ${styles[resultCardMapping()]}`} ref={resultCardRef}>
                        {resultStrMapping()}
                    </div>
                </div>
                <div className={styles["progress-num"]}>{currentWordIdx+1}/{currentRound.length}</div>
                <div className={styles["option-container"]}>
                    <button className={styles["forget-option-button"]} onClick={() => goToTheNextCard(-1)}>
                        Forgot
                    </button>

                    <button className={styles["remember-option-button"]} onClick={() => goToTheNextCard(1)}>
                        Got it
                    </button>
                </div>
            </div>
        </>
    );
};

export { FlashcardPractice, loader, action };
