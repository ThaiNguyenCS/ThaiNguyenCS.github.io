import React, { useState } from "react";
import styles from "./FlashcardCollectionCreatePopup.module.css";
import { generateUUIDV4 } from "../helper_function/idManager";
const FlashcardCollectionCreatePopup = (props) => {
    const [titleInput, setTitleInput] = useState("");
    const [descriptionInput, setDescriptionInput] = useState("");

    const createCollection = () => {
        props.createCollection({
            title: titleInput,
            description: descriptionInput,
            _action: "CREATE_COLLECTION",
            id: generateUUIDV4(),
        });
    };

    return (
        <>
            {props.trigger ? (
                <div className={styles["container"]}>
                    <div className={styles["popup"]}>
                        <div className={styles["popup-title"]}>Create new collection</div>
                        <label htmlFor="title-input" className={`${styles["popup-label"]}`}>
                            Title
                        </label>
                        <input
                            id="title-input"
                            type="text"
                            onChange={(e) => setTitleInput(e.target.value)}
                            value={titleInput}
                            required={true}
                            className={`${styles["title-input"]} ${styles["input-text-format"]}`}
                        />
                        <label htmlFor="description-input" className={`${styles["popup-label"]}`}>
                            Description
                        </label>
                        <textarea
                            value={descriptionInput}
                            id="description-input"
                            onChange={(e) => setDescriptionInput(e.target.value)}
                            className={`${styles["description-textarea"]} ${styles["input-text-format"]}`}
                        />
                        <button onClick={() => {createCollection()}}>Create</button>
                        <button onClick={() => props.closePopup()}>Close</button>
                    </div>
                </div>
            ) : (
                ""
            )}
        </>
    );
};

export { FlashcardCollectionCreatePopup };
