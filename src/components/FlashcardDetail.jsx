import React, { useState } from "react";
import styles from "./FlashcardDetail.module.css";
import { WordItem } from "./WordItem";

const maxPage = 10;

const FlashcardDetail = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const handleTurnPage = (pageNum) => {
        if (currentPage === pageNum) return;
        setCurrentPage(pageNum);
    };

    const turnToTheNextPage = () => {
        setCurrentPage((pageNum) => pageNum + 1);
    };

    const returnToThePrevPage = () => {
        setCurrentPage((pageNum) => pageNum - 1);
    };

    const generateControlButton = () => {
        const pageButtonArr = [];
        let startingPoint = 1; // default is the first page
        if (currentPage === 1) {
        } else if (currentPage === maxPage) {
            startingPoint = maxPage - 2;
        } else {
            startingPoint = currentPage - 1;
        }
        for (let p = startingPoint; p <= startingPoint + 2; p++) {
            pageButtonArr.push(
                <div
                    className={`${styles["button"]} ${p === currentPage ? styles["active"] : ""}`}
                    onClick={() => handleTurnPage(p)}
                >
                    {p}
                </div>
            );
        }
        return (
            <>
                <div
                    className={`${styles["button"]} ${currentPage === 1 ? styles["hidden"] : ""}`}
                    onClick={() => handleTurnPage(1)}
                >
                    &lt;&lt;
                </div>
                <div
                    className={`${styles["button"]} ${currentPage === 1 ? styles["hidden"] : ""}`}
                    onClick={() => returnToThePrevPage()}
                >
                    &lt;
                </div>
                {pageButtonArr.map((button) => button)}
                <div
                    className={`${styles["button"]} ${currentPage === maxPage ? styles["hidden"] : ""}`}
                    onClick={() => turnToTheNextPage()}
                >
                    &gt;
                </div>
                <div
                    className={`${styles["button"]} ${currentPage === maxPage ? styles["hidden"] : ""}`}
                    onClick={() => handleTurnPage(maxPage)}
                >
                    &gt;&gt;
                </div>
            </>
        );
    };
    return (
        <>
            <div className={styles["container"]}>
                <WordItem></WordItem>
                <WordItem></WordItem>
                <WordItem></WordItem>
                <WordItem></WordItem>
                <WordItem></WordItem>
                <WordItem></WordItem>
                <div className={styles["page-controller"]}>{generateControlButton()}</div>
            </div>
        </>
    );
};

export { FlashcardDetail };
