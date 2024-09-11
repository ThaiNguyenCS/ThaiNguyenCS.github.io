import React, { useState } from "react";
import styles from "./AddWordTemplate.module.css";

const AddWordTemplate = (props) => {
    const [isFocus, setFocus] = useState(false);
    const [wordInput, setWordInput] = useState("");
    const [defInput, setDefInput] = useState("");
    const [exampleInput, setExampleInput] = useState("");
        
    const resetInputs = () => {
        setWordInput("")
        setDefInput("")
        setExampleInput("")
    }

    return (
        <>
            {props.active ? (
                <div
                    className={`${styles["container"]} ${isFocus ? styles["focus"] : ""}`}
                    onFocus={() => {
                        setFocus(true);
                    }}
                    onBlur={() => setFocus(false)}
                >
                    <label htmlFor="word-input">Word</label>
                    <input
                        id="word-input"
                        type="text"
                        className={styles["word-input"]}
                        value={wordInput}
                        onChange={(e) => setWordInput(e.target.value)}
                    />

                    <label htmlFor="definition-input">Definition</label>
                    <textarea
                        id="definition-input"
                        className={styles["text-area"]}
                        value={defInput}
                        onChange={(e) => setDefInput(e.target.value)}
                    />

                    <label htmlFor="example-input">Example</label>
                    <textarea
                        id="example-input"
                        className={styles["text-area"]}
                        value={exampleInput}
                        onChange={(e) => setExampleInput(e.target.value)}
                    />
                    <button
                        className={styles["add-button"]}
                        onClick={() => {
                            props.addWord({word: wordInput, definition: defInput, example: exampleInput});
                            resetInputs();
                        }}
                    >
                        Add
                    </button>
                </div>
            ) : (
                ""
            )}
        </>
    );
};

export { AddWordTemplate };
