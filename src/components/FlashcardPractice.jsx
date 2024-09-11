import React, { useEffect, useRef, useState } from "react";
import styles from "./FlashcardPractice.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import { getJWTToken } from "../helper_function/authentication";
import { useLoaderData } from "react-router-dom";
const dataURL = import.meta.env.VITE_DATA_URL;

const loader = async ({ request, params }) => {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.searchParams);
    const wordResponse = await axios.get(
        `${dataURL}/flashcard/${params.id}/practice-words/?limit=${queryParams.get("limit")}`,
        {
            headers: {
                Authorization: `Bearer ${getJWTToken() || "no_token}"}`,
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

const FlashcardPractice = () => {
    console.log("rerrenderr");

    const { words, collection } = useLoaderData();
    const [flipCard, setFlipcard] = useState(false);
    const [resultCard, setResultCard] = useState(null);
    const instantFlip = useRef(false);
    const flashcardRef = useRef(null);
    const resultCardRef = useRef(null);
    const goToTheNextCard = (status) => {
        if (currentWordIdx < words.length - 1) {
            setResultCard(status);
            setCurrentWordIdx((state) => state + 1);
            instantFlip.current = true; // enable instant flip
            setFlipcard(false); // reflip the card
        } else {
            alert("The End!");
        }
    };

    const [currentWordIdx, setCurrentWordIdx] = useState(0);

    useEffect(() => {
        if (words.length > 0) {
            setCurrentWordIdx(0);
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
            case 0:
                return "avg";
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
            case 0:
                return "OK";
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
                        {words[currentWordIdx]?.word}
                    </div>
                    <div className={`${styles["back-side"]}`}>{words[currentWordIdx]?.wordDef}</div>
                    <div className={`${styles["result-card"]} ${styles[resultCardMapping()]}`} ref={resultCardRef}>
                        {resultStrMapping()}
                    </div>
                </div>

                <div className={styles["option-container"]}>
                    <button className={styles["forget-option-button"]} onClick={() => goToTheNextCard(-1)}>
                        Forgot
                    </button>
                    <button className={styles["avg-option-button"]} onClick={() => goToTheNextCard(0)}>
                        OK
                    </button>
                    <button className={styles["remember-option-button"]} onClick={() => goToTheNextCard(1)}>
                        Got it
                    </button>
                </div>
            </div>
        </>
    );
};

export { FlashcardPractice, loader };
