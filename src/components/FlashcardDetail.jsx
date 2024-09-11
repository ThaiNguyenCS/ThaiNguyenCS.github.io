import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./FlashcardDetail.module.css";
import { WordItem } from "./WordItem";
import { getJWTToken } from "../helper_function/authentication";
import { useActionData, useLoaderData, useLocation, useNavigate, useSubmit } from "react-router-dom";
import axios, { all } from "axios";
import { AddWordTemplate } from "./AddWordTemplate";
import { generateUUIDV4 } from "../helper_function/idManager";
import { getMaxPage } from "../helper_function/handleInput";
const dataURL = import.meta.env.VITE_DATA_URL;

const loader = async ({ request, params }) => {
    const token = getJWTToken();
    const response = await axios.get(`${dataURL}/flashcard/${params.id}`, {
        headers: {
            Authorization: `Bearer ${token || "no_token"}`,
        },
    });
    const data = response.data;
    if (data.result) {
        return data.data;
    }
    console.log("No collection");
    return {};
};

const action = async ({ request, params }) => {
    const formData = await request.formData();
    const token = getJWTToken();
    if (formData.get("_action") === "DELETE_COLLECTION") {
        console.log("ACTION DELETE");
        const response = await axios.delete(`${dataURL}/flashcard/${params.id}/delete`, {
            headers: {
                Authorization: `Bearer ${token || "no_token"}`,
            },
        });
        const data = response.data;
        if (data.result) {
            console.log(data.data);
        } else {
            alert("There's something wrong!");
        }
        return { isDeleteSuccessfully: data.result };
    } else if (formData.get("_action") === "ADD") {
        console.log("ACTION ADD");
        const response = await axios.post(`${dataURL}/flashcard/${params.id}/add-word`, formData, {
            headers: {
                Authorization: `Bearer ${token || "no_token"}`,
            },
        });
        const data = response.data;
        if (data.result) {
            console.log(data.data);
        } else {
            alert("There's something wrong!");
        }
        return { isAddSuccessfully: data.result };
    } else if (formData.get("_action") === "DELETE_WORD") {
        console.log("ACTION DELETE WORD");
        const wordID = formData.get("wordID");
        if (wordID) {
            const response = await axios.delete(`${dataURL}/flashcard/${params.id}/words/${wordID}`, {
                headers: {
                    Authorization: `Bearer ${token || "no_token"}`,
                },
            });
            const data = response.data;
            if (data.result) {
                console.log(data.data);
            } else {
                alert("There's something wrong!");
            }
        } else console.log("No wordID");
    }
    return { isDeleteSuccessfully: false, isAddSuccessfully: false };
};

const FlashcardDetail = (props) => {
    const { collection } = useLoaderData();
    const [addWordTemplate, setAddWordTemplate] = useState(false);
    const firstRender = useRef(true);
    const [allWords, setAllWords] = useState([]);
    const requesting = useRef(false);
    const [currentWords, setCurrentWords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [noOfPracticeWords, setNoOfPracticeWords] = useState(10);
    const submit = useSubmit();
    const currentURL = useLocation();
    const actionData = useActionData();
    const navigate = useNavigate();
    const [maxPage, setMaxPage] = useState(1);

    const requestWords = async (isReset) => {
        console.log("requestWords");
        const ranges = []; // always has even number of elements
        let curPage = currentPage;
        if (currentPage > getMaxPage(collection.noOfWords, limit)) {
            // if currentPage is greater than the maxPage
            curPage--;
            setCurrentPage((state) => state - 1);
        }
        let start = (curPage - 1) * limit;
        let end = Math.min(start + limit, collection.noOfWords);
        let isStart = false;
        const wordArr = firstRender.current || isReset ? new Array(collection.noOfWords).fill(null) : allWords;
        console.log("wordArr");
        console.log(wordArr);
        firstRender.current = false; // unmark the first render

        // find missing words to request
        for (let i = start; i < end; i++) {
            if (!wordArr[i]) {
                if (!isStart) {
                    ranges.push(i);
                    isStart = true;
                }
            } else {
                if (isStart) {
                    ranges.push(i - ranges[ranges.length - 1]);
                    isStart = false;
                }
            }
        }
        if (isStart) {
            ranges.push(end - ranges[ranges.length - 1]);
        }
        let queryString = "?";

        for (let i = 1; i <= ranges.length / 2; i++) {
            queryString += `start${i}=${ranges[(i - 1) * 2]}&limit${i}=${ranges[(i - 1) * 2 + 1]}`;
        }
        console.log("ranges");
        if (ranges.length != 0) {
            const result = await axios.get(`${dataURL}/flashcard/${collection.id}/words/${queryString}`, {
                headers: {
                    Authorization: `Bearer ${getJWTToken() || "no_token"}`,
                },
            });
            const data = result.data;
            if (data.result) {
                const words = data.data;
                const newAllWords = [...wordArr];
                for (const entry of Object.entries(words)) {
                    console.log(entry);
                    if (entry[1].result) {
                        for (let i = 0; i < entry[1].result.length; i++) {
                            newAllWords[entry[1].start + i] = entry[1].result[i];
                        }
                    }
                    setAllWords(newAllWords);
                }
            }
        } else {
            setDisplayWords();
            console.log("Data's available already");
        }
        requesting.current = false;
    };

    useEffect(() => {
        if (actionData?.isDeleteSuccessfully) {
            navigate("/flashcard", { replace: true });
        }
    }, [actionData]);

    useEffect(() => {
        if (collection) {
            if (currentPage === 1) {
                // if currentPage is already 1, try request here
                if (!requesting.current) {
                    console.log("request in limit");
                    requesting.current = true;
                    requestWords(false);
                }
            } else {
                // if currentPage is not 1
                setCurrentPage(1); // return to the first page
            }
            setMaxPage(getMaxPage(collection.noOfWords, limit)); // re-evaluate the max page based on current limit
        }
    }, [limit]);

    useEffect(() => {
        if (collection) {
            setAddWordTemplate(false); // close the add word template when turn page
            if (!requesting.current) {
                console.log("request in currentPage");
                requesting.current = true;
                requestWords(false);
            }
        }
    }, [currentPage]);

    useEffect(() => {
        if (collection) {
            console.log("collection change");
            setMaxPage(getMaxPage(collection.noOfWords, limit));
            if (!requesting.current) {
                console.log("request in collection");
                requesting.current = true;
                requestWords(true);
            }
        }
    }, [collection]);

    useEffect(() => {
        console.log("allWords change");
        setDisplayWords();
    }, [allWords]);

    const setDisplayWords = () => {
        if (allWords.length > 0) {
            console.log("allWords");
            console.log(allWords);
            const displayWords = allWords.slice((currentPage - 1) * limit, currentPage * limit);
            console.log("displayWords");
            console.log(displayWords);
            setCurrentWords(displayWords);
        }
    };

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

    const deleteThisCollection = () => {
        const result = window.confirm("Do you actually want to delete this collection?");
        if (result) {
            submit(
                { _action: "DELETE_COLLECTION" },
                {
                    method: "DELETE",
                    action: currentURL.pathname,
                }
            );
        }
    };

    const deleteWord = (wordID) => {
        const result = window.confirm("Do you actually want to delete this word?");
        if (result && wordID) {
            submit(
                { _action: "DELETE_WORD", wordID },
                {
                    method: "DELETE",
                    action: currentURL.pathname,
                }
            );
        }
    };

    const addWordToDatabase = (word) => {
        const formData = new FormData();
        formData.append("_action", "ADD");
        formData.append("id", generateUUIDV4());
        formData.append("collectionID", collection.id);
        formData.append("word", word.word);
        formData.append("definition", word.definition);
        formData.append("example", word.example);
        submit(formData, {
            method: "POST",
        });
    };

    const goToLearnCollection = () => {
        if (collection) navigate(`/flashcard/${collection.id}/practice/?limit=${noOfPracticeWords}`);
        else alert("Please try again");
    };

    const generateControlButton = () => {
        const pageButtonArr = [];
        let startingPoint = 1; // default is the first page
        if (currentPage === 1) {
        } else if (currentPage === maxPage) {
            startingPoint = Math.max(maxPage - 2, 1);
        } else {
            startingPoint = currentPage - 1;
        }
        for (let p = startingPoint; p <= Math.min(startingPoint + 2, maxPage); p++) {
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
                <div>{collection?.title || "NULL TITLE"}</div>
                <div>{collection?.description || ""}</div>
                <button
                    className={styles["learn-button"]}
                    onClick={() => {
                        goToLearnCollection();
                    }}
                >
                    Learn
                </button>
                <label htmlFor="practice-words-select">
                    Choose the number of words you want to practice
                    <select
                        id="practice-words-select"
                        value={noOfPracticeWords}
                        onChange={(e) => setNoOfPracticeWords(Number(e.target.value))}
                    >
                        <option value="10">10 words</option>
                        <option value="20">20 words</option>
                        <option value="30">30 words</option>
                    </select>
                </label>

                <div className={styles["option-container"]}>
                    <button
                        className={`${styles["add-button"]} ${addWordTemplate && styles["invisible"]}`}
                        onClick={() => {
                            setAddWordTemplate(true);
                        }}
                    >
                        Add word
                    </button>
                    <button
                        className={`${styles["add-button"]} ${addWordTemplate || styles["invisible"]}`}
                        onClick={() => {
                            setAddWordTemplate(false);
                        }}
                    >
                        Done
                    </button>
                    <button className={styles["delete-button"]} onClick={() => deleteThisCollection()}>
                        Delete
                    </button>
                </div>

                <select
                    className={styles["limit-select"]}
                    value={limit}
                    onChange={(e) => {
                        console.log(e.target.value);
                        setLimit(Number(e.target.value));
                    }}
                >
                    <option value={10}>10 words/page</option>
                    <option value={20}>20 words/page</option>
                    <option value={50}>50 words/page</option>
                </select>
                <AddWordTemplate active={addWordTemplate} addWord={addWordToDatabase} />
                {currentWords &&
                    currentWords.length > 0 &&
                    currentWords.map((item) => <WordItem word={item} deleteWord={deleteWord} />)}
                <div className={styles["page-controller"]}>{generateControlButton()}</div>
            </div>
        </>
    );
};

export { FlashcardDetail, loader, action };
