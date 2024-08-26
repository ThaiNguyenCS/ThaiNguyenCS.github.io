import React from "react";
import "./Exercises.css";
import { useLoaderData, useNavigate } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const loader = async ({params}) => {
    // console.log(params);
    const token = localStorage.getItem("jwt_token")
    const res = await axios.get(`${apiUrl}/data/${params.topic}`, {headers: {
        Authorization: `Bearer ${token || "no_token"}`
    }});
    console.log(res.data); // {status, data}
    const result = res.data;
    if(result.status)
    {
        return result.data;
    }
    return null;
}
    
const Exercises = () => {
    const navigate = useNavigate();
    const videos = useLoaderData();
    return (
        <>
            <ul>
                {videos &&
                    videos.length > 0 &&
                    videos.map((item, idx) => (
                        <li className="item" key="item.id">
                            <div className="item-title" onClick={() => navigate(`${item.id}`)}>{item.title}</div>
                            <div className="item-no-question">Progress: {item.result || 0}/{item.noOfQuestions}</div>
                        </li>
                    ))}
            </ul>
        </>
    );
};

export {Exercises, loader};