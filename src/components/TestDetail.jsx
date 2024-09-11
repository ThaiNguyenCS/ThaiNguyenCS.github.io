import React, { useEffect, useState } from "react";
const apiURL = import.meta.env.VITE_API_URL;
import axios from "axios";
import styles from "./TestDetail.module.css";
import { Form, Link, redirect, useLoaderData } from "react-router-dom";
import { getFormatDate } from "../helper_function/handleInput";

const loader = async ({ request, params }) => {
    const token = localStorage.getItem("jwt_token");

    const testResponse = await axios.get(`${apiURL}/tests/${params.topic}/${params.id}`);
    const testHistories = await axios.get(`${apiURL}/test/practice/${params.id}/history`, {
        headers: {
            Authorization: `Bearer ${token || "no_token"}`,
        },
    });
    const test = testResponse.data;
    const histories = testHistories.data;
    const obj = {};
    if (test.result) {
        console.log(test.data);
        obj.test = test.data;
    }
    if (histories.result) {
        console.log(histories.data);
        obj.testHistories = histories.data;
    }
    return obj;
};

const action = async ({ request, params }) => {
    const formData = await request.formData();
    console.log(params);
    if (formData.get("__action") === "selectPart") {
        const query = formData
            .getAll("part")
            .map((item) => `part=${item}`)
            .join("&");
        console.log(query);
        return redirect(`/tests/practice/${params.id}?${query}`);
    }
    //   console.log(formData.getAll("part"))
    return null;
};

const TestDetail = () => {
    const { test, testHistories } = useLoaderData();
    const [checkBoxStatus, setCheckBoxStatus] = useState([]);
    const [canSubmit, setCanSubmit] = useState(false);

    useEffect(() => {
        if (test && test.length > 0) {
            setCheckBoxStatus(new Array(test.length).fill(false));
        }
    }, [test]);

    useEffect(() => {
        if (checkBoxStatus.length > 0) {
            console.log(checkBoxStatus);
            const isValid = checkBoxStatus.some((box) => box);
            setCanSubmit(isValid);
        }
    }, [checkBoxStatus]);

    const getDurationStrFromSecond = (second) => {
        const minute = Math.trunc(second / 60);
        const hour = Math.trunc(minute / 60);
        const sec = second % 60;
        return `${hour.toString().padStart(1, "0")}:${minute.toString().padStart(2, "0")}:${sec
            .toString()
            .padStart(2, "0")}`;
    };

    const getPartStr = (partJSON) => {
        let partArr = JSON.parse(partJSON);
        return partArr.join(", ");
    };

    const updateCheckboxStatus = (idx) => {
        console.log("update " + idx);
        let newStatus = [...checkBoxStatus];
        newStatus[idx] = !newStatus[idx];
        setCheckBoxStatus(newStatus);
    };

    return (
        <>
            <div className={styles["container"]}>
                <div className={styles["test-title"]}>{test[0].testTitle || "NULL TITLE"}</div>
                <table className={styles["history-table"]}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Parts</th>
                            <th>Duration</th>
                            <th>Result</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testHistories &&
                            testHistories.length > 0 &&
                            testHistories.map((history) => (
                                <>
                                    <tr>
                                        <td>{getFormatDate(history.startingTime)}</td>
                                        <td>{getPartStr(history.partArr)}</td>
                                        <td>{getDurationStrFromSecond(history.duration)}</td>
                                        <td>
                                            {history.noOfCorrectQuestions}/{history.totalQuestions}
                                        </td>
                                        <td>
                                            <Link to={`/tests/${history.testID}/result/${history.id}`}>Review</Link>
                                        </td>
                                    </tr>
                                </>
                            ))}
                    </tbody>
                </table>
                <div className={styles["choosing-section"]}>
                    <div className={styles["title-bold"]}>Choose parts you want to practice:</div>

                    <Form method="POST">
                        <input type="hidden" name="__action" value={"selectPart"} />
                        {test &&
                            test.map((item, idx) => (
                                <>
                                    <div className={styles['part-container']}>
                                        <label>Part {item.partOrder}</label>
                                        <input
                                            type="checkbox"
                                            className={styles['checkbox-button']}
                                            name="part"
                                            value={item.partOrder}
                                            checked={checkBoxStatus[idx]}
                                            onChange={() => {
                                                updateCheckboxStatus(idx);
                                            }}
                                        />
                                    </div>
                                </>
                            ))}
                        <button type="submit" disabled={!canSubmit} className={styles['start-button']}>
                            Do it!
                        </button>
                    </Form>
                </div>
            </div>
        </>
    );
};

export { TestDetail, loader, action };
