import React from "react";
import styles from "./TestItem.module.css";
import { useNavigate } from "react-router-dom";
import { getFormatDate } from "../helper_function/handleInput";


const TestItem = (props) => {
    const navigate = useNavigate();
    const goToTestDetail = () => {
        navigate(`${props.test.id}`)
    }

    console.log(props.test)
    return (
        <>
            <div className={`${styles["item-container"]} ${props.test.startingTime ? styles["finished-test"] : ''}`}>
                <div className={styles["item-title"]}>
                {props.test.title || "NULL"}
                </div>
                <div className={styles['item-metadata']}>Duration: {props.test.duration || "NULL" } mins</div>
                <div className={styles['item-metadata']}>Status: {props.test.startingTime ? "Done": "Unfinished"}</div>
                <div className={styles['item-metadata']}>Last attempt</div>
                <div className={styles['item-metadata']}>{getFormatDate(props.test.startingTime)}</div>
                <button className={styles['start-button']} onClick={() => {goToTestDetail()}}>{props.test.startingTime ? "Retry": "Start"}</button>
            </div>
        </>
    );
};

export { TestItem };
