import React from "react";
import styles from "./TestItem.module.css";
import { useNavigate } from "react-router-dom";
const TestItem = (props) => {
    const navigate = useNavigate();
    const goToTestDetail = () => {
        navigate(`${props.test.id}`)
    }
    return (
        <>
            <div className={styles["item-container"]}>
                <div className={styles["item-title"]}>
                {props.test.title || "NULL"}
                </div>
                <div className={styles['item-metadata']}>Duration: {props.test.duration || "NULL" } mins</div>
                <div className={styles['item-metadata']}>Status: Done</div>
                <div className={styles['item-metadata']}>Last attempt</div>
                <div className={styles['item-metadata']}>20-08-1964</div>
                <button className={styles['start-button']} onClick={() => {goToTestDetail()}}>Start</button>
            </div>
        </>
    );
};

export { TestItem };
