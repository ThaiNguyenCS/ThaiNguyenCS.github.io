import React, { useEffect, useRef, useState } from "react";
import styles from "./FlashcardDetail.module.css";
import { WordItem } from "./WordItem";
import { getJWTToken } from "../helper_function/authentication";
import { redirect, useActionData, useLoaderData, useLocation, useNavigate, useSubmit } from "react-router-dom";
import axios, { all } from "axios";
import { FlashcardItem } from "./FlashcardItem";
const dataURL = import.meta.env.VITE_DATA_URL;

const loader = async ({ request, params }) => {
    // get the collection and all its words
    // const url = new URL(request.url);
    // const queryParams = url.searchParams;
    // console.log(queryParams)
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
    if (formData.get("_action") === "DELETE") {
        const response = await axios.delete(`${dataURL}/${params.id}/delete`, {
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
        return data.result;
    }
};

const FlashcardDetail = (props) => {
    const { collection } = useLoaderData();
    const [allWords, setAllWords] = useState([]);
    const [currentWords, setCurrentWords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const submit = useSubmit();
    const currentURL = useLocation();
    const deleteResult = useActionData();
    const navigate = useNavigate();
    const [maxPage, setMaxPage] = useState(1);

    const requestWords = async () => {
        const ranges = []; // always has even number of elements
        let start = (currentPage - 1) * limit;
        let end = Math.min(start + limit, collection.noOfWords);
        let isStart = false;
        for (let i = start; i < end; i++) {
            if (!allWords[i]) {
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
        if (ranges.length != 0) {
            const result = await axios.get(`${dataURL}/flashcard/${collection.id}/words/${queryString}`, {
                headers: {
                    Authorization: `Bearer ${getJWTToken() || "no_token"}`,
                },
            });
            const data = result.data;
            if (data.result) return data.data;
        } else {
            setDisplayWords();
            console.log("Data's available already");
            return null;
        }
    };

    useEffect(() => {
        if (deleteResult) {
            navigate("/flashcard", { replace: true });
        }
    }, [deleteResult]);

    useEffect(() => {
        if (collection) {
            setCurrentPage(1); // return to the first page
            setMaxPage(Math.floor(collection.noOfWords / limit) + 1); // re-evaluate the max page based on current limit
        }
    }, [limit]);

    useEffect(() => {
        // navigate(`/flashcard/${collection.id}/?page=${currentPage}&limit=${limit}`);\
        if (collection) {
            const getRequestWords = async () => {
                const words = await requestWords();
                if (words) {
                    console.log(words);
                    const newAllWords = [...allWords];
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
            };
            getRequestWords();
        }
    }, [currentPage]);

    useEffect(() => {
        if (collection) {
            setMaxPage(Math.floor(collection.noOfWords / limit) + 1);
            setAllWords(Array(collection.noOfWords).fill(null));
        }
    }, [collection]);

    useEffect(() => {
        setDisplayWords();
    }, [allWords]);

    const setDisplayWords = () => {
        if (allWords.length > 0) {
            const displayWords = allWords.slice((currentPage - 1) * limit, currentPage * limit);
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
        submit(
            { _action: "DELETE" },
            {
                method: "DELETE",
                action: currentURL.pathname,
            }
        );
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
                <select
                    value={limit}
                    name="noOfWords"
                    onChange={(e) => {
                        console.log(e.target.value);
                        setLimit(Number(e.target.value));
                    }}
                >
                    <option value={10}>10 words/page</option>
                    <option value={20}>20 words/page</option>
                    <option value={50}>50 words/page</option>
                </select>
                <button className={styles["delete-button"]} onClick={() => deleteThisCollection()}>
                    Delete
                </button>
                {currentWords && currentWords.length > 0 && currentWords.map((item) => <WordItem word={item} />)}
                <div className={styles["page-controller"]}>{generateControlButton()}</div>
            </div>
        </>
    );
};

export { FlashcardDetail, loader, action };
