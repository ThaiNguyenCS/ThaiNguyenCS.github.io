import React, { useEffect } from "react";
import "./ContextDictionary.css";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { resetDict } from "../slicers/ContextDictSlice";
const apiURL = import.meta.env.VITE_API_URL;
import axios from "axios";

const ContextDictionary = ({ contextDictRef }) => {
    const dictState = useSelector((state) => state.dictState);
    // if dictState.toggled = true, dictState.selectedWord exists then call API to get dictionary
    console.log(`y ${dictState.position.y} x ${dictState.position.x}`);
    const style = {
        top: dictState.position.y + "px",
        left: dictState.position.x + "px",
    };
    const dispatch = useDispatch();
    const closeContextDict = () => {
        dispatch(resetDict());
    };
    useEffect(() => {
        const getWordFromAPI = async () => {
            if (dictState.toggled && dictState.selectedWord) {
                const response = await axios.get(
                    `${apiURL}/dictionary/${dictState.selectedWord}`
                );
                console.log(response);
            }
        };
        getWordFromAPI();
    }, [dictState]);

    return (
        <>
            <div
                className={`dictionary-context ${
                    dictState.toggled ? "" : "invisible"
                }`}
                ref={contextDictRef}
                style={style}
            >
                <IoMdClose
                    onClick={() => closeContextDict()}
                    className="dict-close-button"
                />

                <div>
                    Word{" "}
                    <span style={{ fontWeight: "bold" }}>
                        {dictState.selectedWord}
                    </span>
                </div>
                <div>IPA</div>
                <div>Pronunciation Button</div>
                <div>English meaning</div>
                <div>Vietnamese</div>
                <div>Example</div>
            </div>
        </>
    );
};

export { ContextDictionary };
