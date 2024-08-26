import React from "react";
import styles from "./TestQuestion.module.css";

const TestQuestion = (props) => {
    const question = props.question;
    return (
        <>
            <div className={styles.container} id={props.id || "question-null-id"}>
                <div className={styles["question-order"]}>
                    {question.questionOrder || "NULL"}
                </div>
                <div className={styles["question-content"]}>
                    {question.questionContent || "NULL"}
                </div>
                {question.qType === "FILL" ? (
                    <>
                        <input type="text" />
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
};

export { TestQuestion };
