import React from "react";
import styles from "./FlashcardItem.module.css"
import { useNavigate } from "react-router-dom";

const FlashcardItem = () => {
    const navigate = useNavigate();
    const goToDetail = () => {
        navigate(`/flashcard/foo`)
    }

    return <>
        <div className={styles['item-container']}>
            <div className={styles['title']} onClick={() => goToDetail()}>My made up deck</div>
            <div className={styles['word-number']}>16 words</div>
        </div>
    </>;
};

export {FlashcardItem}
