import React from "react";
import styles from "./Flashcard.module.css";
import { FlashcardItem } from "./FlashcardItem";

const Flashcard = () => {
    return (
        <>
            <div className={styles["container"]}>
                <div className={styles["title"]}>Flashcard</div>
                <div className={styles["flashcard-collection-container"]}>
                    <FlashcardItem></FlashcardItem>
                    <FlashcardItem></FlashcardItem>
                    <FlashcardItem></FlashcardItem>
                    <FlashcardItem></FlashcardItem>
                    <FlashcardItem></FlashcardItem>
                    <FlashcardItem></FlashcardItem>
                    <FlashcardItem></FlashcardItem>
                    <FlashcardItem></FlashcardItem>
                    <FlashcardItem></FlashcardItem>
                </div>
            </div>
        </>
    );
};

export { Flashcard };
