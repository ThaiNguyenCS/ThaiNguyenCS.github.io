import React from "react";
import styles from "./FlashcardItem.module.css"
import { useNavigate } from "react-router-dom";

const FlashcardItem = (props) => {
    const navigate = useNavigate();
    const goToDetail = () => {
        if(props.item)
            navigate(`/flashcard/${props.item.id}`)
    }

    return <>
        <div className={styles['item-container']}>
            <div className={styles['title']} onClick={() => goToDetail()}>{props.item.title || ""}</div>
            <div className={styles['word-number']}>{props.item.noOfWords || 0} words</div>
        </div>
    </>;
};

export {FlashcardItem}
