import React, { useContext, useEffect, useRef } from "react";
import "./SubmitPopup.css";
import { closePopup } from "../slicers/SubmitPopupSlice";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate} from "react-router-dom"
import { DictationExContext } from "./Dictation"; 
import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL;

const SubmitPopup = (props) => {
    const dispatch = useDispatch();
    const confirmButtRef = useRef(null)
    const isPopupOpen = useSelector((state) => state.submitPopup.isOpen);
    const exContext = useContext(DictationExContext);
    const closeThePopup = () => {
        dispatch(closePopup());
    };

    useEffect(() => {
        console.log(isPopupOpen)
        if(isPopupOpen)
        {
            confirmButtRef.current.focus();
        }
    }, [isPopupOpen])

    const saveResultToDatabase = async () => {
        // data: jwt token, resultArr
        const token = localStorage.getItem('jwt_token');
        if(!token)
        {
            console.log("Token has a problem!")
            return;
        }
        try {
            const res = await axios.post(`${apiURL}/save-progress`, exContext, {headers: {
                Authorization: `Bearer ${token}`
            }});
            const data = res.data;      
            console.log(data)      
            if(data.result)
            {
                closeThePopup();
                navigate("/dictation/youtube-topic");
            }
            else
            {
                console.log("Save FAILED")
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    const navigate = useNavigate();


    useEffect(() => {
        if(exContext.statusArr)
        {
            console.log(JSON.stringify(exContext.statusArr));
            // resultArr.forEach(item => console.log(item))
        }
    }, [exContext])

    return (
        <div className="popup-container">
            <div className="popup-content">
                <button ref={confirmButtRef}  onClick={() => {
                    // action to post result to database and navigate back
                    saveResultToDatabase();
                    // closeThePopup();
                    // navigate("/dictation/youtube-topic")
                }}>OK</button>
                <button onClick={() => closeThePopup()}>Cancel</button>
            </div>
        </div>
    );
};

export default SubmitPopup;
