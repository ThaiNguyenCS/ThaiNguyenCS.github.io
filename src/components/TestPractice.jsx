import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Form, redirect, useLoaderData, useSubmit } from "react-router-dom";
import { TestQuestion } from "./TestQuestion";
import styles from "./TestPractice.module.css";
import { v4 as uuidv4 } from "uuid";

import {
    convertPixelSizeToNumber,
    convertSecondsToTime,
} from "../helper_function/handleInput";
import SubmitPopup from "./SubmitPopup";
const apiURL = import.meta.env.VITE_API_URL;

const loader = async ({ request, params }) => {
    const url = new URL(request.url);
    console.log("start load");
    const response = await axios.get(
        `${apiURL}/tests/foo/${params.id}${url.search}`
    );
    console.log("end load");
    const data = response.data;
    if (data.result) {
        console.log(data.data);
        return data.data;
    }
    console.log("No test practice");
    return null;
};

const action = async ({ request, params }) => {
    console.log("action");
    const formData = await request.formData();
    formData.append("historyID", uuidv4());
    const token = localStorage.getItem("jwt_token");
    const submitResponse = await axios.post(
        `${apiURL}/test/practice/save-test-result`,
        formData,
        {
            headers: { Authorization: `Bearer ${token || "no_token"}` },
        }
    );
    if(submitResponse.data.result)
    {
        return redirect(`/tests/${params.id}`);
    }
    else
    {
        alert("There's something wrong");
    }
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
    const [questionMark, setQuestionMark] = useState({});
    const containerRef = useRef(null);
    const formRef = useRef(null);
    const startingTimeRef = useRef(null);

    const submit = useSubmit();

    useEffect(() => {
        if (parts && parts.length > 0) {
            setCurrentPart(currentPart || parts[0]); // prevent switching currentPart when loader loads data.
        }
    }, [parts]);

    useEffect(() => {
        if (questions && questions.length > 0) {
            const obj = {};
            questions.forEach((item) => (obj[item.id] = false));
            setQuestionMark(obj);
        }
    }, questions);

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
                if (resizeBar.current)
                    resizeBar.current.removeEventListener(
                        "mousedown",
                        listenToSizeChange
                    );
            };
        }
    }, [resizeBar]);

    useEffect(() => {
        startingTimeRef.current = new Date(Date.now());
        console.log(startingTimeRef.current);
        const timeInterval = setInterval(() => {
            second.current++;
            setTiming(convertSecondsToTime(second.current));
        }, 1000);
        return () => {
            clearInterval(timeInterval);
            second.current = 0;
        };
    }, []);

    const sendResult = () => {
        const confirmed = window.confirm(
            "Are you sure you want to submit the test?"
        );
        if (confirmed) {
            if (formRef.current) {
                const formData = new FormData(formRef.current);
                for (const entry of formData.entries()) {
                    console.log(entry);
                }
                submit(formData, { method: "POST" });
            }
        }
    };

    const getPartOrderJSONArr = () => {
        if (parts) {
            const arr = [];
            parts.forEach((part) => arr.push(part.partOrder));
            return JSON.stringify(arr);
        }
        return "";
    };

    const generateSQLTimestamp = () => {
        if (startingTimeRef.current) {
            return startingTimeRef.current
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
        }
        return "";
    };

    const handleSubmit = (event) => {};

    return (
        <>
            <div className={styles["test-title"]}>{test.title || ""}</div>
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
                        <Form ref={formRef}>
                            <input
                                type="hidden"
                                name="testID"
                                value={(test && test.id) || ""}
                            />
                            <input
                                type="hidden"
                                name="partArr"
                                value={getPartOrderJSONArr()}
                            />
                            <input
                                type="hidden"
                                name="startingTime"
                                value={generateSQLTimestamp()}
                            />
                            <input
                                type="hidden"
                                name="duration"
                                value={second.current || 0}
                            />
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
                                                                onClick={() => {
                                                                    setQuestionMark(
                                                                        (
                                                                            state
                                                                        ) => {
                                                                            const newState =
                                                                                {
                                                                                    ...state,
                                                                                };
                                                                            newState[
                                                                                question.id
                                                                            ] =
                                                                                !newState[
                                                                                    question
                                                                                        .id
                                                                                ];
                                                                            return newState;
                                                                        }
                                                                    );
                                                                }}
                                                                className={
                                                                    questionMark[
                                                                        question
                                                                            .id
                                                                    ]
                                                                        ? "book-mark"
                                                                        : ""
                                                                }
                                                                question={
                                                                    question
                                                                }
                                                                id={`question-${question.id}`}
                                                            ></TestQuestion>
                                                        </>
                                                    ))}
                                        </div>
                                    </>
                                ))}
                        </Form>
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
                                                    className={`${
                                                        styles[
                                                            "question-nav-button"
                                                        ]
                                                    } ${
                                                        questionMark[
                                                            question.id
                                                        ]
                                                            ? styles[
                                                                  "book-mark"
                                                              ]
                                                            : ""
                                                    }`}
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
                                                            // console.log(
                                                            //     "Not same"
                                                            // );
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
                                                            question.style.outline =
                                                                "2px solid yellow";
                                                            setTimeout(() => {
                                                                question.style.outline =
                                                                    "none";
                                                            }, 1000);
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
                    <button
                        className={styles["submit-button"]}
                        onClick={() => sendResult()}
                    >
                        Submit
                    </button>
                </div>
            </div>
            {/* <SubmitPopup></SubmitPopup> */}
        </>
    );
};

export { TestPractice, loader, action };