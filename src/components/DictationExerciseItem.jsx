import React from "react";
import styles from "./DictationExerciseItem.module.css";
import { useNavigate } from "react-router-dom";

const DictationExerciseItem = (props) => {
    const navigate = useNavigate();
    const generateExStatus = () => {
        if (props.item) {
            const result = props.item.result;
            if (result === props.item.noOfQuestions) {
                return "done";
            } else if (result > 0) {
                return "ongoing";
            } else {
                return "undone";
            }
        }
    };
    return (
        <>
            <div className={styles["item"]} key={props.item?.id}>
                <div className={styles["item-title"]} onClick={() => navigate(`${props.item?.id}`)}>
                    {props.item?.title}
                </div>
                <div className={`${styles["item-progress-text"]} ${styles[generateExStatus()]}`}>
                    Progress: {props.item?.result || 0}/{props.item?.noOfQuestions}
                </div>
            </div>
        </>
    );
};

export { DictationExerciseItem };
