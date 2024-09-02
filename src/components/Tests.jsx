import React from "react";
import TestsStyle from "./Tests.module.css";
import { FilterButton } from "./FilterButton";
import { TestItem } from "./TestItem";
import { useLoaderData } from "react-router-dom";
import axios from "axios";
import { Calendar } from "./Calendar";
const apiURL = import.meta.env.VITE_API_URL;

const loader = async ({request, params}) => {
    const topicParam = params.topic || "";
    const token = localStorage.getItem("jwt_token");
    const response = await axios.get(`${apiURL}/tests/${topicParam}`, {
        headers: {
            Authorization: `Bearer ${token || "no_token"}`
        }
    });
    const data = response.data;
    if (data.result) {
        console.log(data.data);
        return data.data;
    }
    console.log("No tests");
    return null;
};

const Tests = () => {
    const testArr = useLoaderData();
    return (
        <>
            <div className={TestsStyle.container}>
                <div className={TestsStyle["left-section"]}>
                    <div className={TestsStyle.title}>English Tests</div>
                    <input
                        className={TestsStyle["search-bar"]}
                        placeholder="Search tests... (haven't done yet)"
                    />
                    <button className={TestsStyle["search-button"]}>
                        Search
                    </button>
                    <div className={TestsStyle["filter-container"]}>
                        <FilterButton title="All" categoryURL="all"></FilterButton>
                        <FilterButton title="Ielts Academic" categoryURL="ielts-academic"></FilterButton>
                        <FilterButton title="Toeic" categoryURL="toeic"></FilterButton>
                    </div>
                    <div className={TestsStyle["tests-grid-layout"]}>
                        {(testArr &&
                            testArr.map((test, idx) => (
                                <TestItem
                                    test={test}
                                    key={test.id || idx}
                                ></TestItem>
                            ))) || "No tests"}
                    </div>
                </div>
                <div className={TestsStyle["right-section"]}>
                    <Calendar></Calendar>
                </div>

            </div>
        </>
    );
};

export { Tests, loader };
