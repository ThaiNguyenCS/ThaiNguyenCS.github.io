import React, { useEffect, useRef, useState } from "react";
import styles from "./Calendar.module.css";
import { monthNames } from "../helper_function/timeHandling";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import IcChecked from "../assets/ic_checked.png";

const Calendar = (props) => {
    const currentDate = useRef(new Date(Date.now()));
    const [displayMonth, setDisplayMonth] = useState(new Date(Date.now()).getMonth());
    const [displayYear, setDisplayYear] = useState(new Date(Date.now()).getFullYear());

    const goToNextMonth = () => {
        if (displayMonth === currentDate.current.getMonth() && displayYear === currentDate.current.getFullYear()) {
            return;
        }
        if (displayMonth === 11) {
            setDisplayMonth(0);
            setDisplayYear((state) => state + 1);
        } else {
            setDisplayMonth((state) => state + 1);
        }
    };

    const goToPrevMonth = () => {
        if (displayMonth === 0) {
            setDisplayMonth(11);
            setDisplayYear((state) => state - 1);
        } else {
            setDisplayMonth((state) => state - 1);
        }
    };

    const getActiveDayInMonth = (month) => {
        if (props.streaks) {
            const streakArr = props.streaks.filter((day) => day.month === month);
            return streakArr;
        }
        return [];
    };

    const generateDateInMonth = () => {
        const streakArr = getActiveDayInMonth(displayMonth);

        const lastDayOfMonth = new Date(displayYear, displayMonth + 1, 0);
        const noOfDays = lastDayOfMonth.getDate();
        const dayOfTheFirstDate = new Date(displayYear, displayMonth, 1).getDay(); // 0-indexed starting from Sunday
        let ignoreNumberOfDays = (dayOfTheFirstDate + 6) % 7;
        const dayArr = [];
        while (ignoreNumberOfDays) {
            dayArr.push("");
            ignoreNumberOfDays--;
        }
        for (let i = 1; i <= noOfDays; i++) {
            if (streakArr.find((day) => day.date === i)) {
                dayArr.push(0); // 0 means active day
            } else {
                dayArr.push(i);
            }
        }
        return dayArr.map((day) => (
            <div className={styles["day-cell"]}>
                {day !== 0 ? day : <img src={IcChecked} className={styles["checked-icon"]}></img>}
            </div>
        ));
    };

    return (
        <>
            <div className={styles["calendar-header"]}>
                <div className={styles["calendar-control-button"]} onClick={() => goToPrevMonth()}>
                    <IoIosArrowBack />
                </div>

                <div className={styles["month"]}>{monthNames[displayMonth] + " " + displayYear}</div>
                <div className={styles["calendar-control-button"]} onClick={() => goToNextMonth()}>
                    <IoIosArrowForward />
                </div>
            </div>
            <div className={styles["calendar-body"]}>
                <div className={`${styles["day-cell"]} ${styles["day-header"]}`}>M</div>
                <div className={`${styles["day-cell"]} ${styles["day-header"]}`}>T</div>
                <div className={`${styles["day-cell"]} ${styles["day-header"]}`}>W</div>
                <div className={`${styles["day-cell"]} ${styles["day-header"]}`}>T</div>
                <div className={`${styles["day-cell"]} ${styles["day-header"]}`}>F</div>
                <div className={`${styles["day-cell"]} ${styles["day-header"]}`}>S</div>
                <div className={`${styles["day-cell"]} ${styles["day-header"]}`}>S</div>
                {generateDateInMonth()}
            </div>
        </>
    );
};

export { Calendar };
