import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { AddReminderPopup } from "./AddReminderPopup";
import { useSubmit, useActionData, useLoaderData, Link } from "react-router-dom";
import axios from "axios";
import IcEdit from "../assets/ic_edit.png";
import { useSelector } from "react-redux";
import { axiosRequestWithCookieOption } from "../utils/requestOption";
import { getFormatDate } from "../utils/timeHandling";
import { generateRedirectURL } from "../utils/redirectURL";
const serverURL = import.meta.env.VITE_SERVER_DOMAIN;
const appDomain = import.meta.env.VITE_DOMAIN;

const loader = async ({ params }) => {
    const response = await axios.get(`${serverURL}/reminder`, axiosRequestWithCookieOption);
    const data = response.data;
    if (data.result) {
        return { reminders: data.data };
    }
    return {};
};

const action = async ({ request, params }) => {
    const formData = await request.formData();
    if (formData.get("_action") === "ADD_REMINDER") {
        try {
            const response = await axios.post(`${serverURL}/reminder`, formData, axiosRequestWithCookieOption);
            const data = response.data;
            if (data.result) {
                console.log("add ok");
            } else {
                alert("Something's wrong");
            }
            return { addReminderSuccessfully: data.result };
        } catch (error) {
            console.log(error);
            return { addReminderSuccessfully: false };
        }
    }
    return {};
};

const Profile = () => {
    const [createReminder, setCreateReminder] = useState(false);
    const submit = useSubmit();
    const actionData = useActionData();
    const { reminders } = useLoaderData();
    const appState = useSelector((state) => state.appState);
    console.log(appState);

    const openCreateReminderPopup = () => {
        setCreateReminder(true);
    };

    const closeCreateReminderPopup = () => {
        setCreateReminder(false);
    };

    useEffect(() => {
        if (actionData?.addReminderSuccessfully) {
            setCreateReminder(false); // close the popup when add successfully
        }
    }, [actionData]);

    const addReminder = (data) => {
        let { startDate, finishDate, activeDay, task } = data;
        console.log({ startDate, finishDate, activeDay, task });
        const formData = new FormData();
        formData.append("_action", "ADD_REMINDER");
        formData.append("startDate", startDate);
        formData.append("finishDate", finishDate);
        formData.append("activeDay", activeDay);
        formData.append("task", task);
        submit(formData, { method: "POST" });
    };

    const generateRedirectURLFromLogin = () => {
        return  generateRedirectURL(`${appDomain}/login`, "/profile")
    }

    return (
        <>
            <div className={styles["container"]}>
                {appState.isLogined ? (
                    <>
                        <div className={styles['user-name']}>Hello, {appState.appname}</div>
                        <div className={styles["reminder-header"]}>
                            <h2 className={styles["section-label"]}>My reminder</h2>
                            <button
                                className={styles["add-reminder-button"]}
                                onClick={() => {
                                    openCreateReminderPopup();
                                }}
                            >
                                Add reminder
                            </button>
                        </div>
                        <div>
                            <table className={styles["module-table"]}>
                                <thead>
                                    <tr className={styles["module-tr"]}>
                                        <th className={styles["module-th"]}>Task</th>
                                        <th className={styles["module-th"]}>Begin Date</th>
                                        <th className={styles["module-th"]}>Finish Date</th>
                                        <th className={styles["module-th"]}></th>
                                        <th className={styles["module-th"]}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reminders &&
                                        reminders.length > 0 &&
                                        reminders.map((item) => (
                                            <tr className={styles["module-tr"]}>
                                                <td className={`${styles["module-td"]} ${styles["task"]}`}>
                                                    {item.task}
                                                </td>
                                                <td className={styles["module-td"]} style={{ color: "#636363" }}>
                                                    {getFormatDate(item.startDate)}
                                                </td>
                                                <td className={styles["module-td"]} style={{ color: "#636363" }}>
                                                    {getFormatDate(item.endDate)}
                                                </td>
                                                <td className={styles["module-td"]}>
                                                    <img
                                                        src={IcEdit}
                                                        alt="Edit"
                                                        className={styles["edit-button-icon"]}
                                                    />
                                                </td>
                                                <td className={`${styles["module-td"]} ${styles["delete-button"]}`}>
                                                    Delete
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>{" "}
                    </>
                ) : (
                    <div>Please <Link to={generateRedirectURLFromLogin()}>login</Link> to continue</div>
                )}
            </div>
            {createReminder && <AddReminderPopup closePopup={closeCreateReminderPopup} addReminder={addReminder} />}
        </>
    );
};
export { Profile, loader, action };
