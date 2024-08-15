import React from "react";
import "./Exercises.css";
import { useLoaderData, useNavigate } from "react-router-dom";
import axios from "axios";

const dummyExercises = [
    {
        id: "12345678-1234-1234-1234-123456789ABC",
        title: "bla bla",
        numberOfQuestions: 20,
    },
];

const loader = async ({params}) => {
    console.log(params);
    const res = await axios.get(`/data/${params.topic}`);
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
                            <div className="item-no-question">{item.noOfQuestions}</div>
                        </li>
                    ))}
            </ul>
        </>
    );
};

export default Exercises;
export {loader};