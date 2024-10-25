import React, { useEffect, useState } from "react";
import styles from "./AddReminderPopup.module.css";

const AddReminderPopup = (props) => {
    const [repeatDays, setRepeatDays] = useState([false, false, false, false, false, false, false]);
    const [startDate, setStartDate] = useState(null);
    const [finishDate, setFinishDate] = useState(null);
    const [task, setTask] = useState(""); // task description

    const addReminder = () => {
        // call parent's add function
        console.log(repeatDays.map(item => `${item ? 1 : 0}`).join(""));
        props.addReminder({ activeDay: repeatDays.map(item => `${item ? 1 : 0}`).join(""), startDate, finishDate, task });
    };

    const setRepeatDaily = (e) => {
        if (e.target.checked) {
            setRepeatDays([true, true, true, true, true, true, true]);
        } else {
            setRepeatDays([false, false, false, false, false, false, false]);
        }
    };

    const updateRepeatDays = (e, idx) => {
        const newState = [...repeatDays];
        newState[idx] = e.target.checked;
        setRepeatDays(newState);
    };

    return (
        <>
            <div className={styles["scrim"]}>
                <div className={styles["container"]}>
                    <div className={styles["header-title"]}>Add a reminder</div>
                    <div className={styles["task-section"]}>
                        <label className={styles["title"]}>Task</label>
                        <textarea
                            name="task"
                            id=""
                            className={styles["task-textarea"]}
                            onChange={(e) => setTask(e.target.value)}
                            value={task}
                        ></textarea>
                    </div>
                    <div className={styles["flex-row-center"]}>
                        <label className={styles["title"]}>Start date</label>
                        <input
                            type="date"
                            style={{ marginLeft: "8px" }}
                            onChange={(e) => {
                                // console.log(e.target.value);
                                setStartDate(e.target.value);
                            }}
                        />
                        <label className={styles["title"]} style={{ marginLeft: "20px" }}>
                            Finish date
                        </label>
                        <input
                            type="date"
                            style={{ marginLeft: "8px" }}
                            onChange={(e) => {
                                // console.log(e.target.value);
                                setFinishDate(e.target.value);
                            }}
                        />
                        <label className={`${styles["title"]}`} style={{ marginLeft: "20px" }}>
                            Daily
                        </label>
                        <input
                            type="checkbox"
                            className={styles["check-box"]}
                            style={{ marginLeft: "5px" }}
                            checked={repeatDays.filter((item) => item === false).length === 0}
                            onChange={(e) => {
                                setRepeatDaily(e);
                            }}
                        />
                    </div>
                    <div className={styles["title"]}>Custom repeat</div>

                    <div className={styles["day-picker-container"]}>
                        <label htmlFor="mondayInput" className={`${styles["sub-title"]}`}>
                            Monday
                        </label>
                        <input
                            id="mondayInput"
                            type="checkbox"
                            className={styles["check-box"]}
                            checked={repeatDays[1]}
                            style={{ marginLeft: "5px" }}
                            onChange={(e) => {
                                updateRepeatDays(e, 1);
                            }}
                        />
                        <label
                            htmlFor="tuesdayInput"
                            className={`${styles["sub-title"]}`}
                            style={{ marginLeft: "20px" }}
                        >
                            Tuesday
                        </label>
                        <input
                            type="checkbox"
                            id="tuesdayInput"
                            className={styles["check-box"]}
                            style={{ marginLeft: "5px" }}
                            checked={repeatDays[2]}
                            onChange={(e) => {
                                updateRepeatDays(e, 2);
                            }}
                        />
                        <label
                            htmlFor="wednesdayInput"
                            className={`${styles["sub-title"]}`}
                            style={{ marginLeft: "20px" }}
                        >
                            Wednesday
                        </label>
                        <input
                            id="wednesdayInput"
                            type="checkbox"
                            checked={repeatDays[3]}
                            className={styles["check-box"]}
                            style={{ marginLeft: "5px" }}
                            onChange={(e) => {
                                updateRepeatDays(e, 3);
                            }}
                        />
                        <label
                            htmlFor="thursdayInput"
                            className={`${styles["sub-title"]}`}
                            style={{ marginLeft: "20px" }}
                        >
                            Thursday
                        </label>
                        <input
                            id="thursdayInput"
                            type="checkbox"
                            className={styles["check-box"]}
                            checked={repeatDays[4]}
                            style={{ marginLeft: "5px" }}
                            onChange={(e) => {
                                updateRepeatDays(e, 4);
                            }}
                        />
                        <label
                            htmlFor="fridayInput"
                            className={`${styles["sub-title"]}`}
                            style={{ marginLeft: "20px" }}
                        >
                            Friday
                        </label>
                        <input
                            id="fridayInput"
                            type="checkbox"
                            checked={repeatDays[5]}
                            className={styles["check-box"]}
                            style={{ marginLeft: "5px" }}
                            onChange={(e) => {
                                updateRepeatDays(e, 5);
                            }}
                        />
                        <label
                            htmlFor="saturdayInput"
                            className={`${styles["sub-title"]}`}
                            style={{ marginLeft: "20px" }}
                        >
                            Saturday
                        </label>
                        <input
                            id="saturdayInput"
                            type="checkbox"
                            className={styles["check-box"]}
                            checked={repeatDays[6]}
                            style={{ marginLeft: "5px" }}
                            onChange={(e) => {
                                updateRepeatDays(e, 6);
                            }}
                        />

                        <label
                            htmlFor="sundayInput"
                            className={`${styles["sub-title"]}`}
                            style={{ marginLeft: "20px" }}
                        >
                            Sunday
                        </label>
                        <input
                            id="sundayInput"
                            type="checkbox"
                            className={styles["check-box"]}
                            checked={repeatDays[0]}
                            style={{ marginLeft: "5px" }}
                            onChange={(e) => {
                                updateRepeatDays(e, 0);
                            }}
                        />
                    </div>
                    <div className={styles["option-container"]}>
                        <button
                            className={`${styles["option-button"]} ${styles["add-button"]}`}
                            onClick={() => {
                                addReminder();
                            }}
                        >
                            Add
                        </button>
                        <button
                            className={`${styles["option-button"]} ${styles["cancel-button"]}`}
                            onClick={() => props.closePopup()}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export { AddReminderPopup };
