import React from "react";
import "./SubmitPopup.css";
import { closePopup } from "../slicers/SubmitPopupSlice";
import { useDispatch } from "react-redux";
import {useNavigate} from "react-router-dom"
 
const SubmitPopup = () => {
    const dispatch = useDispatch();

    const closeThePopup = () => {
        dispatch(closePopup());
    };

    const navigate = useNavigate();

    return (
        <div className="popup-container">
            <div className="popup-content">
                <button onClick={() => {
                    // action to post result to database and navigate back
                    closeThePopup();
                    navigate("/dictation/youtube-topic")
                }}>OK</button>
                <button onClick={() => closeThePopup()}>Cancel</button>
            </div>
        </div>
    );
};

export default SubmitPopup;
