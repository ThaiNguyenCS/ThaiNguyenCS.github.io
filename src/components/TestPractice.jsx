import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { TestQuestion } from "./TestQuestion";
import styles from "./TestPractice.module.css";
import {
    convertPixelSizeToNumber,
    convertSecondsToTime,
} from "../helper_function/handleInput";
const apiURL = import.meta.env.VITE_API_URL;
const loader = async ({ request, params }) => {
    const url = new URL(request.url);
    const response = await axios.get(
        `${apiURL}/tests/foo/${params.id}${url.search}`
    );
    const data = response.data;
    if (data.result) {
        console.log(data.data);
        return data.data;
    }
    console.log("No test practice");
    return null;
};

const TestPractice = () => {
    // console.log("TestPractice");
    const { test, parts, sections, questions } = useLoaderData();
    const [currentPart, setCurrentPart] = useState(null);
    const [timing, setTiming] = useState("00:00");

    const second = useRef(0);
    const questionSection = useRef(null);
    const answerSection = useRef(null);
    const resizeBar = useRef(null);
    const containerRef = useRef(null);
    useEffect(() => {
        if (parts && parts.length > 0) {
            setCurrentPart(parts[0]);
        }
    }, [parts]);

    useEffect(() => {
        if (resizeBar) {
            let marginLeft = getComputedStyle(resizeBar.current).marginLeft;
            let marginRight = getComputedStyle(resizeBar.current).marginRight;
            const totalResizeBarWidth =
                convertPixelSizeToNumber(marginLeft) +
                convertPixelSizeToNumber(marginRight) +
                resizeBar.current.offsetWidth;
            console.log(questionSection.current.getBoundingClientRect());
            function resize(e) {
                console.log(e.clientX); // e.clientX is the position in the middle of the resize bar
                const leftBoundary =
                    questionSection.current.getBoundingClientRect().left;
                const rightBoundary =
                    answerSection.current.getBoundingClientRect().right;
                if (
                    e.clientX + 50 > rightBoundary ||
                    e.clientX - 50 < leftBoundary
                )
                    return;
                // console.log("container Width " + (rightBoundary-leftBoundary));
                const containerWidth = rightBoundary - leftBoundary;
                const leftWidth =
                    e.clientX - leftBoundary - totalResizeBarWidth / 2;
                const rightWidth =
                    containerWidth - leftWidth - totalResizeBarWidth;
                questionSection.current.style.flexBasis = leftWidth + "px";
                answerSection.current.style.flexBasis = rightWidth + "px";
                console.log("leftWidth " + leftWidth);
                console.log("rightWidth " + rightWidth);
            }

            function stopResize() {
                document.removeEventListener("mousemove", resize);
                document.removeEventListener("mouseup", stopResize);
            }

            function listenToSizeChange() {
                document.addEventListener("mousemove", resize);
                document.addEventListener("mouseup", stopResize);
            }
            resizeBar.current.addEventListener("mousedown", listenToSizeChange);
            return () => {
                document.removeEventListener("mousemove", resize);
                document.removeEventListener("mouseup", stopResize);
                resizeBar.current.remove("mousedown", listenToSizeChange);
            };
        }
    }, [resizeBar]);

    useEffect(() => {
        const timeInterval = setInterval(() => {
            second.current++;
            setTiming(convertSecondsToTime(second.current));
        }, 1000);
        return () => {
            clearInterval(timeInterval);
            second.current = 0;
        };
    }, []);

    return (
        <>
            <div className={styles["test-title"]}>{test.title}</div>
            <div className={styles["container"]}>
                <div className={styles["test-side"]} ref={containerRef}>
                    <div
                        className={styles["left-section"]}
                        // style={{ flexBasis: '0%' }}
                        ref={questionSection}
                    >
                        {parts &&
                            parts.length > 0 &&
                            parts.map((part) => (
                                <>
                                    <div
                                        className={`${
                                            styles["part-container"]
                                        } ${
                                            part === currentPart
                                                ? styles["active"]
                                                : ""
                                        }`}
                                    >
                                        <div>
                                            Part:{" "}
                                            {part.partOrder ||
                                                "NULL PART ORDER"}
                                        </div>
                                        <div>
                                            {part.title || "NULL PART TITLE"}
                                        </div>
                                        <div>
                                            {part.partGuide ||
                                                "NULL PART GUIDE"}
                                        </div>
                                        <div>
                                            {part.partContent ||
                                                "NULL PART CONTENT"}
                                        </div>
                                    </div>
                                </>
                            ))}
                    </div>
                    <div className={styles["resize-bar"]} ref={resizeBar}></div>
                    <div
                        className={styles["right-section"]}
                        // style={{ flexBasis: '0%' }}
                        ref={answerSection}
                    >
                        {currentPart &&
                            sections &&
                            sections.length > 0 &&
                            sections.map((section) => (
                                <>
                                    <div
                                        className={`${
                                            styles["section-container"]
                                        } ${
                                            section.partOrder ===
                                            currentPart.partOrder
                                                ? styles["active"]
                                                : ""
                                        }`}
                                    >
                                        <div>
                                            Section:{" "}
                                            {section.sectionOrder ||
                                                "NULL SECTION ORDER"}
                                        </div>
                                        <div>
                                            {section.title ||
                                                "NULL SECTION TITLE"}
                                        </div>
                                        <div>
                                            {section.sectionGuide ||
                                                "NULL SECTION GUIDE"}
                                        </div>

                                        {questions &&
                                            questions.length > 0 &&
                                            questions
                                                .filter(
                                                    (question) =>
                                                        question.sectionOrder ===
                                                            section.sectionOrder &&
                                                        question.partOrder ===
                                                            section.partOrder
                                                )
                                                .map((question) => (
                                                    <>
                                                        <TestQuestion
                                                            question={question}
                                                            id={`question-${question.id}`}
                                                        ></TestQuestion>
                                                    </>
                                                ))}
                                    </div>
                                </>
                            ))}
                    </div>
                </div>
                <div className={styles["control-side"]}>
                    <div>Time</div>
                    <div>{timing}</div>
                    <div>
                        {parts &&
                            parts.length > 0 &&
                            parts.map((part) => (
                                <>
                                    <div>
                                        Part{" "}
                                        {part.partOrder || "NULL PART ORDER"}
                                    </div>
                                    <div
                                        className={
                                            styles["question-nav-container"]
                                        }
                                    >
                                        {questions
                                            .filter(
                                                (question) =>
                                                    question.partOrder ===
                                                    part.partOrder
                                            )
                                            .map((question) => (
                                                <div
                                                    className={
                                                        styles[
                                                            "question-nav-button"
                                                        ]
                                                    }
                                                    data-question-id={`question-${question.id}`}
                                                    data-part-order={
                                                        part.partOrder
                                                    }
                                                    onClick={(e) => {
                                                        if (
                                                            Number(
                                                                e.target.dataset
                                                                    .partOrder
                                                            ) ===
                                                            currentPart.partOrder
                                                        ) {
                                                            console.log("Same");
                                                        } else {
                                                            setCurrentPart(
                                                                parts.find(
                                                                    (part) =>
                                                                        part.partOrder ===
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .dataset
                                                                                .partOrder
                                                                        )
                                                                )
                                                            );
                                                            console.log(
                                                                "Not same"
                                                            );
                                                        }
                                                        // console.log(
                                                        //     e.target.dataset
                                                        // );
                                                        const question =
                                                            document.querySelector(
                                                                `#${e.target.dataset.questionId}`
                                                            );
                                                            setTimeout(() => {
                                                                question.scrollIntoView(
                                                                    {
                                                                        block: "center",
                                                                        inline: "nearest",
                                                                        behavior:
                                                                            "smooth",
                                                                    }
                                                                );
                                                                question.style.outline = "2px solid yellow";
                                                                setTimeout(() => {
                                                                    question.style.outline = "none";
                                                                }, 1000)        
                                                            }, 25);
                                                        
                                                    }}
                                                >
                                                    {question.questionOrder}
                                                </div>
                                            ))}
                                    </div>
                                </>
                            ))}
                    </div>
                    <button className={styles["submit-button"]}>Submit</button>
                </div>
            </div>
        </>
    );
};

export { TestPractice, loader };
