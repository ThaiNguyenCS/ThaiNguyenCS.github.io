import React, { useEffect, useRef } from "react";
import styles from "./WordItem.module.css";
import IcAudio from "../assets/ic_audio.png";
import axios from "axios"
// word, ipa, audio button, definition, example, (image)

const audioURL = "https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3";



const WordItem = () => {

    const audioRef = useRef(null);

    const playAudio = () => 
    {
        if(audioRef.current)
        {
            audioRef.current.play();
        }

    }

    return (
        <>
            <div className={styles["container"]}>
                <div className={styles["word-header"]}>
                    <div className={styles["word"]}>shepherd</div>
                    <img src={IcAudio} className={styles["audio-button"]} onClick={() => playAudio()}/>
                    <audio ref={audioRef}>
                        <source src="https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3" type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>

                    <div>US</div>
                </div>
                <div className={styles["ipa"]}>/'ʃep.ɚd/</div>
                <div className={styles["word-info-title"]}>Definitions</div>
                <ul>
                    <li>a person whose job is to take care of sheep and move them from one place to another</li>
                    <li>a person whose job is to take care of sheep and move them from one place to another</li>
                </ul>

                <div className={styles["word-info-title"]}>Examples</div>
                <div></div>
                <ul>
                    <li>a shepherd boy</li>
                    <li>a shepherd boy</li>
                </ul>

            </div>
        </>
    );
};

export { WordItem };
