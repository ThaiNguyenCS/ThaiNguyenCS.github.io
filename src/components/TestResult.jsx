// Data requirements: test ID, test title, partContent, partArr, history and user's answers
// Prerequisites: user authentication.
/*
    Features: enable review single question (partContent, question)
*/
import React from "react";
import axios from "axios";
import { useLoaderData, useNavigate } from "react-router-dom";
import styles from "./TestResult.module.css";
import IcCorrect from "../assets/ic_correct.png";
import IcIncorrect from "../assets/ic_incorrect.png";
import { getDurationStrFromSecond, getPartStr } from "../utils/handleInput";

import { getFormatDateTime } from "../utils/timeHandling";
import { axiosRequestWithCookieOption } from "../utils/requestOption";

const apiURL = import.meta.env.VITE_API_URL;

const loader = async ({ request, params }) => {
    const token = localStorage.getItem("jwt_token");
    const response = await axios.get(
        `${apiURL}/test/${params.id}/result/${params.historyID}`,
        axiosRequestWithCookieOption
    );
    const data = response.data;
    if (data.result) {
        return data.data;
    }
    console.log("null data");
    return {};
};

const TestResult = () => {
    const { questionResult, partResult, historyResult } = useLoaderData();
    const navigate = useNavigate();

    const generatePartAndQuestionResult = () => {
        if (partResult) {
            return partResult.map((part) => (
                <>
                    <div className={styles["part-holder"]}>
                        <div className={styles["part-title"]}>Part {part.partOrder}</div>
                        <div className={styles["answer-container"]}>
                            {questionResult &&
                                questionResult
                                    .filter((question) => question.partOrder === part.partOrder)
                                    .map((question) => (
                                        <>
                                            <div className={styles["question-item"]}>
                                                <div className={styles["question-order"]}>{question.questionOrder}</div>
                                                <span className={styles["question-answer"]}>{question.answer}</span>
                                                <span>&nbsp;-&nbsp;</span>
                                                <span>{question.userAnswer || "No answer"}</span>
                                                <img
                                                    src={question.result === 1 ? IcCorrect : IcIncorrect}
                                                    className={styles["status-icon"]}
                                                ></img>
                                            </div>
                                        </>
                                    ))}
                        </div>
                    </div>
                </>
            ));
        } else return <>NULL</>;
    };

    const retakeTest = () => {
        if (partResult) {
            const partQuery = partResult.map((part) => `part=${part.partOrder}`).join("&");
            navigate(`/tests/practice/${historyResult.testID}?${partQuery}`);
        } else {
            alert("Please try again!");
        }
    };

    return (
        <>
            <div className={styles["container"]}>
                <div className={styles["left-section"]}>
                    <div className={styles["test-title"]}>{(historyResult && historyResult.title) || "NULL TITLE"}</div>
                    <div className={styles["test-history-title"]}>Histories</div>
                    <table>
                        <thead>
                            <tr>
                                <th className={styles["module-th"]}>Date</th>
                                <th className={styles["module-th"]}>Parts</th>
                                <th className={styles["module-th"]}>Duration</th>
                                <th className={styles["module-th"]}>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyResult && (
                                <>
                                    <tr>
                                        <td className={styles["module-td"]}>
                                            {getFormatDateTime(historyResult.startingTime)}
                                        </td>
                                        <td className={styles["module-td"]}>{getPartStr(historyResult.partArr)}</td>
                                        <td className={styles["module-td"]}>
                                            {getDurationStrFromSecond(historyResult.duration)}
                                        </td>
                                        <td className={styles["module-td"]}a>
                                            {historyResult.noOfCorrectQuestions}/{historyResult.totalQuestions}
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                    <button className={styles["retake-button"]} onClick={() => retakeTest()}>
                        Retake
                    </button>
                    <div>{generatePartAndQuestionResult()}</div>
                </div>
            </div>
        </>
    );
};

export { TestResult, loader };
