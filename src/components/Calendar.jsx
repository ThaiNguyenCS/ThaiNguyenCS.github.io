import React, { useEffect, useState } from "react";
import styles from "./Calendar.module.css";
import { monthNames } from "../helper_function/timeHandling";
const dummyMonth = {
    monthIdx: 8,
    year: 2024,
    noOfDays: 30,
    firstDay: 6
}

const Calendar = () => {
    const [displayMonth, setDisplayMonth] = useState(new Date(Date.now()).getMonth());
    const [displayYear, setDisplayYear] = useState(new Date(Date.now()).getFullYear());


    const goToNextMonth = () => {
        if(displayMonth === 11)
        {
            setDisplayMonth(0);
            setDisplayYear(state => state+1);
        }
        else
        {
            setDisplayMonth(state => state + 1);
        }
    }

    const goToPrevMonth = () => {
        if(displayMonth === 0)
        {
            setDisplayMonth(11);
            setDisplayYear(state => state-1);
        }
        else
        {
            setDisplayMonth(state => state - 1);
        }
    }

    const generateDateInMonth = () => {
        const lastDayOfMonth = new Date(displayYear, displayMonth+1, 0);
        const noOfDays = lastDayOfMonth.getDate();
        const dayOfTheFirstDate = new Date(displayYear, displayMonth, 1).getDay(); // 0-indexed starting from Sunday
        let ignoreNumberOfDays = (dayOfTheFirstDate+6)%7;
        const dayArr = []
        while(ignoreNumberOfDays)
        {
            dayArr.push("");
            ignoreNumberOfDays--;
        }
        for(let i = 1; i <= noOfDays; i++)
        {
            dayArr.push(i);
        }
        return dayArr.map(day => (
            <div className={styles['day-cell']}>{day}</div>    
        ))
    }

    return (<>
    <div className={styles['calendar-header']}>
        <div onClick={() => goToPrevMonth()}>Prev</div>
        <div className={styles['month']}>{monthNames[displayMonth] + " " + displayYear}</div>
        <div onClick={() => goToNextMonth()}>Next</div>
    </div>
    <div className={styles['calendar-body']}>
        <div className={styles['day-cell']}>M</div>
        <div className={styles['day-cell']}>T</div>
        <div className={styles['day-cell']}>W</div>
        <div className={styles['day-cell']}>T</div>
        <div className={styles['day-cell']}>F</div>
        <div className={styles['day-cell']}>S</div>
        <div className={styles['day-cell']}>S</div>
        {generateDateInMonth()}
    </div>
    </>)
}

export {Calendar}