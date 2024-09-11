import React, { useEffect, useRef } from "react";
import TestsStyle from "./Tests.module.css";
import { FilterButton } from "./FilterButton";
import { TestItem } from "./TestItem";
import { useLoaderData, useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar } from "./Calendar";
import { useSelector } from "react-redux";
const apiURL = import.meta.env.VITE_API_URL;
const serverDomain = import.meta.env.VITE_SERVER_DOMAIN;

const loader = async ({ request, params }) => {
    console.log("loader");
    const topicParam = params.topic || "";
    const token = localStorage.getItem("jwt_token");
    const response = await axios.get(`${apiURL}/tests/${topicParam}`, {
        headers: {
            Authorization: `Bearer ${token || "no_token"}`,
        },
    });
    let streaks = null;
    if (token) {
        const streakResponse = await axios.get(`${serverDomain}/data/user-data/streaks`, {
            headers: {
                Authorization: `Bearer ${token || "no_token"}`,
            },
        });
        const streakData = streakResponse.data;
        if (streakData.result) {
            streaks = streakData.data;
        }
    }
    const data = response.data;
    if (data.result) {
        console.log(data.data);
        return { testArr: data.data, streaks };
    }
    console.log("No tests");
    return null;
};

const Tests = () => {
    console.log("Tests render");
    const { testArr, streaks } = useLoaderData();

    return (
        <>
            <div className={TestsStyle.container}>
                <div className={TestsStyle["left-section"]}>
                    <div className={TestsStyle.title}>English Tests</div>
                    <input className={TestsStyle["search-bar"]} placeholder="Search tests... (haven't done yet)" />
                    <button className={TestsStyle["search-button"]}>Search</button>
                    <div className={TestsStyle["filter-container"]}>
                        <FilterButton title="All" categoryURL="all"></FilterButton>
                        <FilterButton title="Ielts Academic" categoryURL="ielts-academic"></FilterButton>
                        <FilterButton title="Toeic" categoryURL="toeic"></FilterButton>
                    </div>
                    <div className={TestsStyle["tests-grid-layout"]}>
                        {(testArr &&
                            testArr.map((test, idx) => <TestItem test={test} key={test.id || idx}></TestItem>)) ||
                            "No tests"}
                    </div>
                </div>
                <div className={TestsStyle["right-section"]}>
                    <Calendar streaks={streaks}></Calendar>
                </div>
            </div>
        </>
    );
};

export { Tests, loader };
