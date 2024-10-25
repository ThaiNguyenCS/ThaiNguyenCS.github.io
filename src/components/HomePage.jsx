import React, { Suspense, useState } from "react";
import { defer, useNavigation, Await, useLoaderData, useSubmit, Link } from "react-router-dom";
import { axiosRequestWithCookieOption } from "../utils/requestOption";
import axios from "axios";
import styles from "./HomePage.module.css";
import { TestItem } from "./TestItem";
const serverURL = import.meta.env.VITE_SERVER_DOMAIN;
const apiURL = import.meta.env.VITE_API_URL;

const loader = async ({ request, params }) => {
    const todayReminderPromise = axios
        .get(`${serverURL}/reminder/today`, axiosRequestWithCookieOption)
        .then((response) => response.data);
    const testsPromise = axios
        .get(`${apiURL}/tests/all`, axiosRequestWithCookieOption)
        .then((response) => response.data);
    return defer({ reminders: todayReminderPromise, tests: testsPromise });
};

const action = async ({ request, params }) => {
    const formData = await request.formData();
    if (formData.get("_action") === "UPDATE_STATUS") {
        try {
            await axios.patch(`${serverURL}/reminder/${formData.get("id")}`, formData, axiosRequestWithCookieOption);
            return { updateSuccessfully: true };
        } catch (error) {
            console.log(error);
            return { updateSuccessfully: false };
        }
    }
    return {};
};

const HomePage = () => {
    console.log("Homepage", Date.now());
    const data = useLoaderData();
    const submit = useSubmit();

    const updateReminderStatus = (e, taskID) => {
        // setSelectedStatuses((state) => ({ ...state, [taskID]: e.target.value }));
        const formData = new FormData();
        formData.append("newStatus", e.target.value);
        formData.append("id", taskID);
        formData.append("_action", "UPDATE_STATUS");
        submit(formData, {
            method: "PATCH",
        });
    };

    return (
        <>
            <div className={styles["container"]}>
                <section className={styles["section-container"]}>
                    <h2 className={styles["section-title"]}>Today reminders</h2>
                    <Suspense fallback={<div>Wait for the first</div>}>
                        <Await resolve={data.reminders} errorElement={<p>Error loading package location!</p>}>
                            {(reminders) => {
                                return (
                                    <>
                                        {reminders.result ? (
                                            reminders.data.length > 0 ? (
                                                <table className={styles["reminder-table"]}>
                                                    <thead className={styles["reminder-thead"]}>
                                                        <tr>
                                                            <th className={styles["reminder-th"]}>Task</th>
                                                            <th className={styles["reminder-th"]}>Status</th>
                                                            <th></th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {reminders.data.length > 0 &&
                                                            reminders.data.map((item) => (
                                                                <tr key={item.id} className={styles["reminder-tr"]}>
                                                                    <td
                                                                        className={`
                                                                    ${
                                                                        item.reminder_instances[0].rmdStatus ===
                                                                            "Finish" && styles["finish-task"]
                                                                    } ${styles["reminder-td"]} ${styles["task-td"]}`}
                                                                    >
                                                                        {item.task}
                                                                    </td>
                                                                    <td
                                                                        className={`${styles["reminder-td"]} ${styles["status-td"]}`}
                                                                    >
                                                                        <select
                                                                            className={styles["status-select"]}
                                                                            id={item.id}
                                                                            value={item.reminder_instances[0].rmdStatus}
                                                                            onChange={(e) => {
                                                                                updateReminderStatus(e, item.id);
                                                                            }}
                                                                        >
                                                                            <option
                                                                                value="Not Started"
                                                                                className={styles["not-started"]}
                                                                            >
                                                                                Not started
                                                                            </option>
                                                                            <option
                                                                                value="Progress"
                                                                                className={styles["in-progress"]}
                                                                            >
                                                                                In progress
                                                                            </option>
                                                                            <option
                                                                                value="Finish"
                                                                                className={styles["finish"]}
                                                                            >
                                                                                Finish
                                                                            </option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div>You don't have any reminders today</div>
                                            )
                                        ) : (
                                            <div>
                                                Please <Link to={"/login"}>login</Link> to see your tasks
                                            </div>
                                        )}
                                    </>
                                );
                            }}
                        </Await>
                    </Suspense>
                </section>

                <Suspense fallback={<div>Loading...</div>}>
                    <Await resolve={data.tests} errorElement={<p>Error loading package location!</p>}>
                        {(tests) => {
                            return (
                                <>
                                    <section className={styles["section-container"]}>
                                        <h2 className={styles["section-title"]}>Tests</h2>
                                        <div className={styles["tests-grid-layout"]}>
                                            {tests.data.length > 0 &&
                                                tests.data.map((item) => <TestItem test={item} />)}
                                        </div>
                                    </section>
                                </>
                            );
                        }}
                    </Await>
                </Suspense>

                <div>Lich su lam bai</div>
                <div>Kham pha dictation</div>
            </div>
        </>
    );
};

export default HomePage;
export { loader, action };
