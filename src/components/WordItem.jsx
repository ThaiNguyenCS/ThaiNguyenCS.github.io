import React, { useEffect, useRef, useState } from "react";
import styles from "./WordItem.module.css";
import IcAudio from "../assets/ic_audio.png";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
const dataURL = import.meta.env.VITE_DATA_URL;
// word, ipa, audio button, definition, example, (image)

const audioURL = "https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3";

const WordItem = (props) => {
    const audioRef = useRef(null);

    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };
    const [word, setWord] = useState(null);
    useEffect(() => {
        setWord(props.word);
    }, [props.word]);

    const deleteWord = (wordID) => {
        props.deleteWord(wordID);
    };

    return (
        <>
            <div className={styles["container"]}>
                <div className={styles["word-header"]}>
                    <div className={styles["word"]}>{word?.word}</div>
                    <img src={IcAudio} className={styles["audio-button"]} onClick={() => playAudio()} />
                    <audio ref={audioRef}>
                        <source src={word?.audioURL} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>

                    <div>US</div>
                </div>
                <div className={styles["ipa"]}>{word?.ipa}</div>
                <div className={styles["word-info-title"]}>Definitions</div>
                <ul>
                    <li>{word?.wordDef}</li>
                </ul>

                <div className={styles["word-info-title"]}>Examples</div>
                <div></div>
                <ul>
                    <li>{word?.example}</li>
                </ul>
                <FaTrashAlt
                    className={styles["delete-button-icon"]}
                    onClick={() => {
                        deleteWord(word?.id);
                    }}
                />
            </div>
        </>
    );
};

export { WordItem };
