import React from "react";
const apiURL = import.meta.env.VITE_API_URL;
import axios from "axios";
import styles from "./TestDetail.module.css";
import { Form, redirect, useLoaderData } from "react-router-dom";

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const loader = async ({ params }) => {
    const token = localStorage.getItem("jwt_token");

    const testResponse = await axios.get(`${apiURL}/tests/foo/${params.id}`);
    const testHistories = await axios.get(
        `${apiURL}/test/practice/${params.id}/history`,
        {
            headers: {
                Authorization: `Bearer ${token || "no_token"}`,
            },
        }
    );
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

    const getDurationStrFromSecond =  (second) => {
        const minute = Math.trunc(second / 60);
        const hour = Math.trunc(minute / 60);
        const sec = second % 60;
        return `${hour.toString().padStart(1, '0')}:${minute.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
    }

    const getFormatDate = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()} ${date.getHours().toString().padStart(2, 0)}:${date.getMinutes().toString().padStart(2, 0)}:${date.getSeconds().toString().padStart(2, 0)}`;
    }

    const getPartStr = (partJSON) => 
    {
        let partArr = JSON.parse(partJSON);
        return partArr.join(", ");
    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Parts</th>
                        <th>Duration</th>
                        <th>Result</th>
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
                                        {history.noOfCorrectQuestions}/
                                        {history.totalQuestions}
                                    </td>
                                </tr>
                            </>
                        ))}
                </tbody>
            </table>
         
            <Form method="POST">
                <input type="hidden" name="__action" value={"selectPart"} />
                {test &&
                    test.map((item, idx) => (
                        <>
                            <label>Part {item.partOrder}</label>
                            <input
                                type="checkbox"
                                name="part"
                                value={item.partOrder}
                            />
                        </>
                    ))}
                <button type="submit">Do it!</button>
            </Form>
        </>
    );
};

export { TestDetail, loader, action };
