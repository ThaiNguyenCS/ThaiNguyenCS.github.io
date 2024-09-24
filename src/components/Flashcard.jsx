import React, { useEffect, useState } from "react";
import styles from "./Flashcard.module.css";
import { FlashcardItem } from "./FlashcardItem";
import { IoIosAdd } from "react-icons/io";
import { FlashcardCollectionCreatePopup } from "./FlashcardCollectionCreatePopup";
import axios from "axios";
import { redirect, useLoaderData, useLocation, useSubmit } from "react-router-dom";
import { getJWTToken } from "../utils/authentication";
import { axiosRequestWithCookieOption } from "../utils/requestOption";
const dataURL = import.meta.env.VITE_DATA_URL;

const loader = async () => {
    const token = getJWTToken();
    const response = await axios.get(`${dataURL}/flashcard`, axiosRequestWithCookieOption);
    const data = response.data;
    if (data.result) {
        console.log(data.data);
        return data.data;
    } else {
        console.log("No collections");
        return [];
    }
};

const action = async ({ request }) => {
    console.log("action");
    const token = getJWTToken();
    const formData = await request.formData();
    console.log(formData);
    if (formData.get("_action") === "CREATE_COLLECTION") {
        const response = await axios.post(`${dataURL}/flashcard-collection`, formData, axiosRequestWithCookieOption);
        const data = response.data;
        if (data.result) {
            return redirect(`/flashcard/${formData.get("id")}`);
        }
    }
    return null;
};

const Flashcard = () => {
    const [createPopup, setCreatePopup] = useState(false);
    const flashcardCollections = useLoaderData();
    const submit = useSubmit();
    const currentURL = useLocation();
    useEffect(() => {
        return () => (document.querySelector("body").style.overflow = "auto"); // return the intact state of body 
    }, []);

    const openCreatePopup = () => {
        setCreatePopup(true);
        document.querySelector("body").style.overflow = "hidden"; // prevent scrolling while popup's triggered
    };

    const closePopup = () => {
        setCreatePopup(false);
        document.querySelector("body").style.overflow = "scroll"; // prevent scrolling while popup's triggered
    };

    const createNewFlashcardCollection = (data) => {
        console.log(data);
        const formData = new FormData();
        for (const entry of Object.entries(data)) {
            formData.append(entry[0], entry[1]);
        }
        submit(formData, { method: "POST", action: currentURL.pathname });
    };

    return (
        <>
            <div className={`${styles["container"]} `}>
                <div className={styles["title"]}>Flashcard</div>
                <div className={styles["stat"]}>{flashcardCollections?.length} collections</div>
                <div className={styles["option-container"]}>
                    <button
                        className={styles["add-button"]}
                        onClick={() => {
                            openCreatePopup();
                        }}
                    >
                        <IoIosAdd className={styles["button-icon"]} />
                    </button>
                </div>

                <div className={styles["flashcard-collection-container"]}>
                    {flashcardCollections.length > 0 &&
                        flashcardCollections.map((item) => <FlashcardItem item={item}></FlashcardItem>)}
                </div>
            </div>
            <FlashcardCollectionCreatePopup
                trigger={createPopup}
                closePopup={closePopup}
                createCollection={createNewFlashcardCollection}
            />
        </>
    );
};

export { Flashcard, loader, action };
