import React, { useState } from "react";
import styles from "./TestQuestion.module.css";

const TestQuestion = (props) => {
    const question = props.question;

    return (
        <>
            <div className={`${styles["container"]}`} id={props.id || "question-null-id"}>
                <div className={styles['question-section']}>
                    <div className={`${styles["question-order"]} ${styles[props.className]}`} onClick={props.onClick}>
                        {question.questionOrder || "NULL"}
                    </div>
                    <div className={styles["question-content"]}>{question.questionContent || "NULL"}</div>
                </div>
                <div className={styles['answer-section']}>
                    {question.qType === "FILL" ? (
                        <>
                            <input
                                type="text"
                                className={styles["question-input"]}
                                name={question.id}
                                value={props.value || ""}
                                onChange={(e) => props.onInputChange(e, question.id)}
                            />
                        </>
                    ) : (
                        <>
                            {question.answerArr.map((answer, idx) => (
                                <>
                                    <input
                                        id={`answer-${question.id}-${idx}`}
                                        type="radio"
                                        name={question.id}
                                        style={{ marginRight: "2px" }}
                                        value={answer}
                                        className={styles['question-radio-input']}
                                        onChange={(e) => {
                                            props.onInputChange(e, question.id);
                                        }}
                                    />
                                    <label htmlFor={`answer-${question.id}-${idx}`} style={{ marginRight: "10px" }}>
                                        {answer}
                                    </label>
                                </>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export { TestQuestion };
